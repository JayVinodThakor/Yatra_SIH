import { motion } from "framer-motion";
import { CarFront, MapPin, TrainFront } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface JourneyMapProps {
  routeGeometry?: any;
  origin?: string;
  destination?: string;
}

interface Point {
  lon: number;
  lat: number;
}

const FALLBACK_PATH =
  "M70 320 C170 280 170 180 300 220 C430 260 430 100 630 75";

const JourneyMap = ({
  routeGeometry,
  origin,
  destination,
}: JourneyMapProps) => {
  const [storedPlan, setStoredPlan] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("yatra_latest_plan");

      if (saved) {
        setStoredPlan(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Could not load saved Yatra plan:", error);
    }
  }, []);

  /*
   * Use props when available.
   * Otherwise read the latest successful plan saved by PlanJourney.
   */
  const plan = storedPlan;

  const actualRoute =
    routeGeometry ||
    plan?.map_details?.route_geometry ||
    plan?.mapDetails?.route_geometry ||
    plan?.journey_details?.route_geometry;

  const actualOrigin =
    origin ||
    plan?.origin ||
    plan?.journey_details?.origin ||
    "Origin";

  const actualDestination =
    destination ||
    plan?.destination ||
    plan?.journey_details?.destination ||
    "Destination";

  /*
   * Extract coordinates from the ORS GeoJSON response.
   */
  const routePoints = useMemo<Point[]>(() => {
    try {
      if (!actualRoute) return [];

      const feature =
        actualRoute?.features?.[0] ||
        (actualRoute?.type === "Feature" ? actualRoute : null);

      const coordinates = feature?.geometry?.coordinates;

      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return [];
      }

      return coordinates
        .filter(
          (point: any) =>
            Array.isArray(point) &&
            point.length >= 2 &&
            Number.isFinite(Number(point[0])) &&
            Number.isFinite(Number(point[1]))
        )
        .map((point: any) => ({
          lon: Number(point[0]),
          lat: Number(point[1]),
        }));
    } catch {
      return [];
    }
  }, [actualRoute]);

  /*
   * Convert longitude/latitude into our SVG coordinate system.
   */
  const mappedRoute = useMemo(() => {
    if (routePoints.length < 2) {
      return {
        path: FALLBACK_PATH,
        start: { x: 70, y: 320 },
        end: { x: 630, y: 75 },
        hasRealRoute: false,
      };
    }

    const width = 700;
    const height = 400;
    const padding = 45;

    const lons = routePoints.map((p) => p.lon);
    const lats = routePoints.map((p) => p.lat);

    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const lonRange = Math.max(maxLon - minLon, 0.000001);
    const latRange = Math.max(maxLat - minLat, 0.000001);

    const scaleX = (width - padding * 2) / lonRange;
    const scaleY = (height - padding * 2) / latRange;

    const scale = Math.min(scaleX, scaleY);

    const routeWidth = lonRange * scale;
    const routeHeight = latRange * scale;

    const offsetX = (width - routeWidth) / 2;
    const offsetY = (height - routeHeight) / 2;

    const project = (point: Point) => ({
      x: offsetX + (point.lon - minLon) * scale,
      y: height - (offsetY + (point.lat - minLat) * scale),
    });

    /*
     * ORS can return thousands of points.
     * We don't need every single point for an SVG.
     * Keeping every 2nd/3rd point makes rendering smoother.
     */
    const step = routePoints.length > 1800 ? 3 : routePoints.length > 900 ? 2 : 1;

    const visiblePoints = routePoints.filter(
      (_, index) =>
        index % step === 0 ||
        index === routePoints.length - 1
    );

    const projected = visiblePoints.map(project);

    const path = projected
      .map((point, index) =>
        index === 0
          ? `M${point.x.toFixed(2)} ${point.y.toFixed(2)}`
          : `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`
      )
      .join(" ");

    return {
      path,
      start: project(routePoints[0]),
      end: project(routePoints[routePoints.length - 1]),
      hasRealRoute: true,
    };
  }, [routePoints]);

  return (
    <section className="bg-[#f2f0e9] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-2xl bg-[#102942] lg:grid-cols-[.8fr_1.2fr]">

          {/* LEFT CONTENT */}
          <div className="p-7 text-white md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#79b4ca]">
              Living journey map
            </p>

            <h2 className="mt-3 font-serif text-3xl">
              See every connection.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/55">
              Follow your complete journey from home to the final destination.
            </p>

            <div className="mt-8 space-y-3 text-xs text-white/70">
              <div className="flex items-center gap-3">
                <CarFront className="h-4 w-4 text-[#e49a32]" />
                First-mile connection
              </div>

              <div className="flex items-center gap-3">
                <TrainFront className="h-4 w-4 text-[#6fa8c7]" />
                Main journey
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#d87979]" />
                Final destination
              </div>
            </div>

            {mappedRoute.hasRealRoute && (
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Live route
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  {actualOrigin} → {actualDestination}
                </p>

                <p className="mt-1 text-xs text-[#79b4ca]">
                  ORS road geometry
                </p>
              </div>
            )}
          </div>

          {/* MAP */}
          <div className="relative min-h-[350px] overflow-hidden bg-[#0b2135]">

            {/* subtle grid */}
            <svg
              viewBox="0 0 700 400"
              className="absolute inset-0 h-full w-full opacity-[0.08]"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="map-grid"
                  width="35"
                  height="35"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 35 0 L 0 0 0 35"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect width="700" height="400" fill="url(#map-grid)" />
            </svg>

            <svg
              viewBox="0 0 700 400"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >

              {/* Route glow */}
              <path
                d={mappedRoute.path}
                fill="none"
                stroke="#75abc2"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.08"
              />

              {/* REAL ORS ROUTE */}
              <motion.path
                id="ors-journey-route"
                d={mappedRoute.path}
                fill="none"
                stroke="#75abc2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 9"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              />

              {/* START POINT */}
              <circle
                cx={mappedRoute.start.x}
                cy={mappedRoute.start.y}
                r="13"
                fill="#4d8b72"
                opacity="0.15"
              />

              <circle
                cx={mappedRoute.start.x}
                cy={mappedRoute.start.y}
                r="7"
                fill="#4d8b72"
              />

              {/* END POINT */}
              <circle
                cx={mappedRoute.end.x}
                cy={mappedRoute.end.y}
                r="14"
                fill="#d87979"
                opacity="0.15"
              />

              <circle
                cx={mappedRoute.end.x}
                cy={mappedRoute.end.y}
                r="8"
                fill="#d87979"
              />

              {/* MOVING TRAIN */}
              <g>
                <animateMotion
                  dur="7s"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href="#ors-journey-route" />
                </animateMotion>

                <foreignObject
                  x="-18"
                  y="-18"
                  width="36"
                  height="36"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl">
                    <TrainFront className="h-4 w-4 text-[#3678a6]" />
                  </div>
                </foreignObject>
              </g>

            </svg>

            {/* START LABEL */}
            <div
              className="absolute rounded-lg bg-[#102942]/90 px-3 py-1.5 text-[10px] text-white shadow-lg backdrop-blur"
              style={{
                left: `${(mappedRoute.start.x / 700) * 100}%`,
                top: `${(mappedRoute.start.y / 400) * 100}%`,
                transform: "translate(-10%, 15px)",
              }}
            >
              {actualOrigin}
            </div>

            {/* DESTINATION LABEL */}
            <div
              className="absolute rounded-lg bg-[#102942]/90 px-3 py-1.5 text-[10px] text-white shadow-lg backdrop-blur"
              style={{
                left: `${(mappedRoute.end.x / 700) * 100}%`,
                top: `${(mappedRoute.end.y / 400) * 100}%`,
                transform: "translate(-90%, -130%)",
              }}
            >
              {actualDestination}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyMap;