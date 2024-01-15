import { lazy } from "react";

const Login = lazy(() => import("../../views/Login"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));


const AuthenticationRoutes = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
        layout: 'blank',
        publicRoute: true,
        restricted: true
    },
  },
 
];

export default AuthenticationRoutes;