import useJwt from '@src/@core/auth/jwt/useJwt'
import apiConfig from '../configs/apiConfig'
import axios from "axios";

axios.defaults.baseURL = apiConfig.baseUrl;

const { jwt } = useJwt({})

export default jwt;