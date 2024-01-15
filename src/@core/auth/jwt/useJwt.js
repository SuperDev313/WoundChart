// ** JWT Service Import
import JwtService from "./jwtService";

// ** Export Service as useJwt
export default function useJwt(jwtOverrideConfig) {
  const jwt = new JwtService(jwtOverrideConfig);

  return {
    jwt,
  };
}
