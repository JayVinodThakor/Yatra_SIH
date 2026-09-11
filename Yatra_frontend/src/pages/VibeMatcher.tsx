import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Destination = "Delhi" | "Mumbai" | "Jaipur" | "Bengaluru";

type Place = {
  name: string;
  area: string;
  description: string;
  vibes: string[];
  image: string;
};

type MatchResult = Place & {
  score: number;
  matchedVibes: string[];
};

/* =========================================================
   DESTINATION DATA
========================================================= */

const places: Record<Destination, Place[]> = {
  Delhi: [
    {
      name: "Lodhi Garden",
      area: "Central Delhi",
      description:
        "Peaceful gardens, historic tombs and lush green walking paths.",
      vibes: ["garden", "green", "nature", "peaceful", "heritage"],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Lodhi_garden_delhi.jpg/960px-Lodhi_garden_delhi.jpg",
    },

    {
      name: "Humayun's Tomb",
      area: "Nizamuddin",
      description:
        "Majestic Mughal architecture surrounded by beautiful landscaped gardens.",
      vibes: ["heritage", "architecture", "peaceful", "symmetry", "garden"],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Humayun%27s_Tomb_in_delhi.jpg/960px-Humayun%27s_Tomb_in_delhi.jpg",
    },

    {
      name: "Sunder Nursery",
      area: "Near Humayun's Tomb",
      description:
        "Beautiful gardens, heritage structures and quiet green pathways.",
      vibes: ["garden", "green", "nature", "peaceful", "heritage"],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sunder_Nursery_Delhi.jpg/500px-Sunder_Nursery_Delhi.jpg",
    },
  ],

  Mumbai: [
    {
      name: "Marine Drive",
      area: "South Mumbai",
      description:
        "Iconic seaside promenade with an open horizon and relaxing atmosphere.",
      vibes: ["beach", "sea", "water", "sunset", "city"],
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Sanjay Gandhi National Park",
      area: "Borivali",
      description:
        "A huge green escape inside Mumbai with forests, trails and wildlife.",
      vibes: ["green", "nature", "forest", "peaceful", "garden"],
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Gateway of India",
      area: "Colaba",
      description:
        "Historic waterfront landmark with grand architecture and harbour views.",
      vibes: ["heritage", "architecture", "sea", "city", "history"],
      image:
        "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  Jaipur: [
    {
      name: "Amber Fort",
      area: "Amer",
      description:
        "Grand hilltop fort featuring dramatic architecture and historic courtyards.",
      vibes: ["fort", "heritage", "architecture", "hill", "history"],
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Hawa Mahal",
      area: "Pink City",
      description:
        "The iconic pink facade and intricate windows of Jaipur's old city.",
      vibes: ["architecture", "heritage", "city", "symmetry", "history"],
      image:
        "https://images.unsplash.com/photo-1599661046827-dacff0c7c6a8?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Jal Mahal",
      area: "Amer Road",
      description:
        "Beautiful palace floating in Man Sagar Lake surrounded by hills.",
      vibes: ["water", "heritage", "sunset", "peaceful", "hill"],
      image:
        "https://images.unsplash.com/photo-1599661046827-dacff0c7c6a8?auto=format&fit=crop&w=1200&q=80",
    },
  ],

  Bengaluru: [
    {
      name: "Lalbagh Botanical Garden",
      area: "South Bengaluru",
      description:
        "Historic botanical garden filled with greenery, flowers and peaceful paths.",
      vibes: ["garden", "green", "nature", "peaceful", "park"],
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Cubbon Park",
      area: "Central Bengaluru",
      description:
        "Large urban green space perfect for relaxed walks beneath old trees.",
      vibes: ["green", "park", "nature", "peaceful", "garden"],
      image:
        "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80",
    },

    {
      name: "Bangalore Palace",
      area: "Vasanth Nagar",
      description:
        "Historic royal palace with distinctive architecture and grand interiors.",
      vibes: ["heritage", "architecture", "royal", "history", "symmetry"],
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

/* =========================================================
   IMAGE ANALYSIS
   This analyzes the ACTUAL uploaded image.
   No filename dependency.
========================================================= */

const analyzeImageVibe = (imageSrc: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        const size = 120;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(["nature", "green", "peaceful"]);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);

        const data = ctx.getImageData(
          0,
          0,
          size,
          size
        ).data;

        let bluePixels = 0;
        let greenPixels = 0;
        let warmPixels = 0;
        let darkPixels = 0;
        let brightPixels = 0;

        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = (r + g + b) / 3;

          /*
           * BLUE / SKY / WATER
           */
          if (
            b > r * 1.15 &&
            b > g * 1.05 &&
            b > 90
          ) {
            bluePixels++;
          }

          /*
           * GREEN / VEGETATION
           */
          if (
            g > r * 1.08 &&
            g > b * 1.05 &&
            g > 70
          ) {
            greenPixels++;
          }

          /*
           * WARM / SAND / STONE / ARCHITECTURE
           */
          if (
            r > b * 1.25 &&
            g > b * 1.08 &&
            r > 90
          ) {
            warmPixels++;
          }

          if (brightness < 65) {
            darkPixels++;
          }

          if (brightness > 190) {
            brightPixels++;
          }
        }

        const blueRatio = bluePixels / totalPixels;
        const greenRatio = greenPixels / totalPixels;
        const warmRatio = warmPixels / totalPixels;
        const darkRatio = darkPixels / totalPixels;
        const brightRatio = brightPixels / totalPixels;

        const vibes: string[] = [];

        /*
         * MOUNTAIN / HILL / OUTDOOR
         *
         * Mountain photographs commonly have
         * blue sky + green terrain.
         */
        if (
          blueRatio > 0.08 &&
          greenRatio > 0.08
        ) {
          vibes.push(
            "mountain",
            "hill",
            "nature",
            "green",
            "peaceful"
          );
        }

        /*
         * WATER / BEACH
         */
        else if (blueRatio > 0.18) {
          vibes.push(
            "beach",
            "sea",
            "water",
            "sunset",
            "peaceful"
          );
        }

        /*
         * GREEN LANDSCAPE
         */
        else if (greenRatio > 0.16) {
          vibes.push(
            "garden",
            "green",
            "nature",
            "park",
            "peaceful"
          );
        }

        /*
         * HERITAGE / WARM ARCHITECTURE
         */
        else if (warmRatio > 0.17) {
          vibes.push(
            "heritage",
            "architecture",
            "history",
            "royal"
          );
        }

        /*
         * DARK ARCHITECTURE
         */
        else if (darkRatio > 0.35) {
          vibes.push(
            "architecture",
            "heritage",
            "history",
            "dramatic"
          );
        }

        /*
         * BRIGHT OUTDOOR PHOTO
         */
        else if (brightRatio > 0.45) {
          vibes.push(
            "nature",
            "green",
            "open",
            "peaceful"
          );
        }

        /*
         * DEFAULT
         */
        else {
          vibes.push(
            "nature",
            "peaceful",
            "architecture",
            "heritage"
          );
        }

        resolve(vibes);
      } catch {
        resolve([
          "nature",
          "green",
          "peaceful",
        ]);
      }
    };

    img.onerror = () => {
      resolve([
        "nature",
        "green",
        "peaceful",
      ]);
    };

    img.src = imageSrc;
  });
};

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function PlaceImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#deded8] via-[#eeeeea] to-[#cfcfc8]">
        <div className="text-center">
          <ImageIcon
            size={38}
            className="mx-auto text-black/25"
          />

          <p className="mt-2 text-xs text-black/35">
            Image preview unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function VibeMatcher() {
  const navigate = useNavigate();

  const [destination, setDestination] =
    useState<Destination>("Delhi");

  const [uploadedImage, setUploadedImage] =
    useState<string | null>(null);

  const [fileName, setFileName] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [detectedVibes, setDetectedVibes] =
    useState<string[]>([]);

  const [results, setResults] =
    useState<MatchResult[]>([]);

  /* =======================================================
     RUN MATCHING
  ======================================================= */

  const runMatching = async (
    imageSrc: string,
    selectedDestination: Destination
  ) => {
    setAnalyzing(true);
    setHasSearched(false);
    setResults([]);

    const vibes =
      await analyzeImageVibe(imageSrc);

    setDetectedVibes(vibes);

    /*
     * Small delay so the animation feels like
     * an actual AI analysis.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const destinationPlaces =
      places[selectedDestination];

    const scored: MatchResult[] =
      destinationPlaces
        .map((place) => {
          const matchedVibes =
            place.vibes.filter((vibe) =>
              vibes.includes(vibe)
            );

          const ratio =
            matchedVibes.length /
            Math.max(vibes.length, 1);

          /*
           * Demo confidence score based on
           * actual detected visual categories.
           */
          const score = Math.min(
            97,
            Math.max(
              74,
              74 + Math.round(ratio * 25)
            )
          );

          return {
            ...place,
            score,
            matchedVibes,
          };
        })
        .sort(
          (a, b) => b.score - a.score
        );

    setResults(scored);
    setAnalyzing(false);
    setHasSearched(true);
  };

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const imageSrc =
        reader.result as string;

      setUploadedImage(imageSrc);
      setFileName(file.name);

      await runMatching(
        imageSrc,
        destination
      );
    };

    reader.readAsDataURL(file);
  };

  /* =======================================================
     REMOVE IMAGE
  ======================================================= */

  const removeImage = () => {
    setUploadedImage(null);
    setFileName("");
    setAnalyzing(false);
    setHasSearched(false);
    setResults([]);
    setDetectedVibes([]);
  };

  /* =======================================================
     DESTINATION CHANGE
  ======================================================= */

  const handleDestinationChange = (
    value: Destination
  ) => {
    setDestination(value);

    setResults([]);
    setHasSearched(false);

    /*
     * If user already uploaded an image,
     * automatically re-run matching for
     * the new destination.
     */
    if (uploadedImage) {
      runMatching(
        uploadedImage,
        value
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f2] text-[#111111]">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f6f6f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-semibold transition hover:opacity-60"
          >
            <ArrowLeft size={18} />
            Back to YATRA
          </button>

          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles size={17} />
            YATRA Vibe Matcher
          </div>
        </div>
      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
            <Sparkles size={15} />

            AI-powered destination discovery
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Find places that
            <span className="block text-black/40">
              match your vibe.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/55">
            Upload a photo of a place you love.
            YATRA analyzes its visual character
            and finds similar places around your
            destination.
          </p>
        </motion.div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[420px_1fr]">
        {/* =================================================
            LEFT CONTROL PANEL
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="h-fit rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
        >
          {/* STEP 01 */}

          <div className="mb-7">
            <p className="text-sm font-medium text-black/40">
              STEP 01
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Where are you going?
            </h2>
          </div>

          {/* DESTINATION */}

          <div className="mb-7">
            <label className="mb-2 block text-sm font-medium text-black/60">
              Destination
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
              />

              <select
                value={destination}
                onChange={(e) =>
                  handleDestinationChange(
                    e.target.value as Destination
                  )
                }
                className="w-full appearance-none rounded-2xl border border-black/10 bg-[#f7f7f4] py-4 pl-11 pr-4 outline-none transition focus:border-black/30"
              >
                <option value="Delhi">
                  Delhi
                </option>

                <option value="Mumbai">
                  Mumbai
                </option>

                <option value="Jaipur">
                  Jaipur
                </option>

                <option value="Bengaluru">
                  Bengaluru
                </option>
              </select>
            </div>
          </div>

          {/* STEP 02 */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-black/60">
                STEP 02 · Upload inspiration
              </label>

              {uploadedImage && (
                <button
                  onClick={removeImage}
                  className="text-black/40 transition hover:text-black"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* UPLOAD BOX */}

            {!uploadedImage ? (
              <label className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/15 bg-[#fafaf7] p-8 text-center transition hover:border-black/35 hover:bg-[#f4f4ef]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="mb-5 rounded-2xl bg-black p-4 text-white transition duration-300 group-hover:scale-105">
                  <Camera size={28} />
                </div>

                <p className="font-semibold">
                  Upload a photo
                </p>

                <p className="mt-2 text-sm text-black/45">
                  JPG, PNG or WEBP
                </p>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-black">
                <img
                  src={uploadedImage}
                  alt="Uploaded inspiration"
                  className="h-[260px] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-16 text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={17} />

                    <span className="max-w-[280px] truncate text-sm font-medium">
                      {fileName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ANALYSIS STATUS */}

          {analyzing && (
            <div className="mt-6 rounded-2xl bg-black p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />

                <div>
                  <p className="text-sm font-medium">
                    Analyzing your photo...
                  </p>

                  <p className="mt-0.5 text-xs text-white/45">
                    Detecting visual characteristics
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DETECTED VIBES */}

          {detectedVibes.length > 0 &&
            !analyzing && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-black/35">
                  Detected vibe
                </p>

                <div className="flex flex-wrap gap-2">
                  {detectedVibes
                    .slice(0, 5)
                    .map((vibe) => (
                      <span
                        key={vibe}
                        className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white"
                      >
                        #{vibe}
                      </span>
                    ))}
                </div>
              </div>
            )}

          {/* REUPLOAD */}

          {uploadedImage &&
            !analyzing && (
              <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-black/10 px-5 py-4 text-sm font-semibold transition hover:bg-black hover:text-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <Camera size={17} />

                Try another photo
              </label>
            )}

          <p className="mt-5 text-center text-xs leading-5 text-black/35">
            Your image is analyzed locally in
            the browser for this demo.
          </p>
        </motion.section>

        {/* =================================================
            RESULTS AREA
        ================================================= */}

        <section>
          {/* EMPTY STATE */}

          {!hasSearched &&
            !analyzing && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="flex min-h-[620px] flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white p-10 text-center"
              >
                <div className="mb-6 rounded-3xl bg-[#f3f3ef] p-6">
                  <ImageIcon
                    size={40}
                    className="text-black/30"
                  />
                </div>

                <h2 className="text-2xl font-semibold">
                  Your matches will appear here
                </h2>

                <p className="mt-3 max-w-md text-black/45">
                  Pick a destination and upload
                  a photo. YATRA will discover
                  places with a similar visual
                  atmosphere.
                </p>
              </motion.div>
            )}

          {/* ANALYZING STATE */}

          {analyzing && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="flex min-h-[620px] flex-col items-center justify-center rounded-[28px] border border-black/10 bg-black p-10 text-center text-white"
            >
              <div className="mb-7 rounded-full border border-white/10 p-7">
                <Sparkles
                  size={42}
                  className="animate-pulse"
                />
              </div>

              <h2 className="text-3xl font-semibold">
                YATRA is finding your vibe
              </h2>

              <p className="mt-3 max-w-md text-white/45">
                Looking at the visual character
                of your photo and comparing it
                with places around{" "}
                {destination}.
              </p>

              <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{
                    x: "-100%",
                  }}
                  animate={{
                    x: "100%",
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/2 rounded-full bg-white"
                />
              </div>
            </motion.div>
          )}

          {/* RESULTS */}

          {hasSearched &&
            !analyzing && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                {/* RESULT HEADER */}

                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-black/40">
                      VIBE MATCHES
                    </p>

                    <h2 className="mt-1 text-3xl font-semibold">
                      Places in {destination}
                    </h2>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm md:flex">
                    <CheckCircle2 size={16} />

                    {results.length} matches
                  </div>
                </div>

                {/* DETECTED VIBE SUMMARY */}

                <div className="mb-6 rounded-2xl border border-black/10 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-black p-2.5 text-white">
                      <Sparkles size={18} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        YATRA detected
                      </p>

                      <p className="mt-1 text-sm text-black/45">
                        Your photo has visual
                        characteristics matching:
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {detectedVibes
                          .slice(0, 5)
                          .map((vibe) => (
                            <span
                              key={vibe}
                              className="rounded-full bg-[#f1f1ed] px-3 py-1.5 text-xs font-medium text-black/60"
                            >
                              #{vibe}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARDS */}

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {results.map(
                    (place, index) => (
                      <motion.article
                        key={place.name}
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.12,
                        }}
                        className="group overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* IMAGE */}

                        <div className="relative h-64 overflow-hidden bg-[#e8e8e3]">
                          <PlaceImage
                            src={place.image}
                            alt={place.name}
                          />

                          {/* SCORE */}

                          <div className="absolute right-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-sm font-bold shadow-lg backdrop-blur">
                            {place.score}% vibe
                          </div>

                          {/* BEST MATCH */}

                          {index === 0 && (
                            <div className="absolute bottom-4 left-4 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                              ✦ Best match
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}

                        <div className="p-5">
                          <h3 className="text-xl font-semibold">
                            {place.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-1.5 text-sm text-black/40">
                            <MapPin size={14} />

                            {place.area}
                          </div>

                          <p className="mt-4 text-sm leading-6 text-black/50">
                            {place.description}
                          </p>

                          {/* MATCHED VIBES */}

                          <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-black/30">
                              Why it matches
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {place.matchedVibes
                                .slice(0, 4)
                                .map(
                                  (vibe) => (
                                    <span
                                      key={vibe}
                                      className="rounded-full bg-[#f2f2ed] px-3 py-1.5 text-xs text-black/55"
                                    >
                                      #{vibe}
                                    </span>
                                  )
                                )}
                            </div>
                          </div>

                          {/* PLAN */}

                          <button
                            onClick={() =>
                              navigate(
                                "/plan"
                              )
                            }
                            className="mt-5 flex w-full items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
                          >
                            Plan a journey here

                            <ArrowRight
                              size={16}
                            />
                          </button>
                        </div>
                      </motion.article>
                    )
                  )}
                </div>

                {/* FOOTER NOTE */}

                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/50">
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-black"
                  />

                  <span>
                    YATRA analyzed the uploaded
                    image locally and ranked
                    destination places according
                    to detected visual vibe
                    signals.
                  </span>
                </div>
              </motion.div>
            )}
        </section>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-black/10 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-black/40">
          <span>
            YATRA · Intelligent Travel
          </span>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition hover:text-black"
          >
            <ArrowLeft size={15} />

            Back to home
          </button>
        </div>
      </footer>
    </div>
  );
}