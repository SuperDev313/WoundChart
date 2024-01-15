// ** Auth Endpoints
export default {
  loginEndpoint: "/account/signin",
  registerEndpoint: "/account/signup",
  refreshEndpoint: "/jwt/refresh-token",
  logoutEndpoint: "/jwt/logout",

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "dev_accessToken",
  storageRefreshTokenKeyName: "dev_refreshToken",
};
