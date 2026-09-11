/* eslint-disable prefer-const */
import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { routes } from "./routes";
import BlankLayout from "../components/layouts/BlankLayout";
import DefaultLayout from "../components/layouts/DefaultLayout";

export type RouteObjectWithLayout = RouteObject & {
  layout?: "default" | "blank";
};

const finalRoutes = routes.map(routeLayoutResolver);

function routeLayoutResolver(route: RouteObjectWithLayout): RouteObject {
  let { layout, ...rest } = route;

  // eslint-disable-next-line no-useless-assignment
  let element = <></>;
  switch (layout) {
    case "blank":
      element = <BlankLayout>{route.element}</BlankLayout>;
      break;
    default:
      element = <DefaultLayout>{route.element}</DefaultLayout>;
      break;
  }
  return {
    ...rest,
    element: element,
  };
}

const router = createBrowserRouter(finalRoutes);

export default router;