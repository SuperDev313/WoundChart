import { lazy } from "react";

// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** GetRoutes
import { getRoutes } from "./routes";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

const Login = lazy(() => import("../views/Login"));
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));
const Error = lazy(() => import("../views/pages/misc/Error"));


const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return '/login'
    }
  }
 
  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: "/login",
      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      path: "/misc/not-authorized",
      element: <BlankLayout />,
      children: [{ path: "/misc/not-authorized", element: <NotAuthorized /> }],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
