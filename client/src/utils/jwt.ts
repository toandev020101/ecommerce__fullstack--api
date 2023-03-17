import jwtDecode, { JwtPayload } from 'jwt-decode';
import * as authApi from '../apis/authApi';

const JWTManager = () => {
  const LOGOUT_EVENT_NAME = 'ecomshop_logout';
  let inMemoryToken: string | null = null;
  let refreshTokenTimeoutId: number | null = null;
  let userId: number | null = null;

  const getToken = () => inMemoryToken;

  const getUserId = () => userId;

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken;

    // decode and set countdown to refresh
    const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken);
    userId = decoded.userId;

    setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number));

    return true;
  };

  const abortRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId);
  };

  const deleteToken = () => {
    inMemoryToken = null;
    abortRefreshToken();
    window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString());
    return true;
  };

  // To logout all tabs (nullify inMemoryToken)
  window.addEventListener('storage', (e) => {
    if (e.key === LOGOUT_EVENT_NAME) {
      inMemoryToken = null;
    }
  });

  const getRefreshToken = async () => {
    try {
      // call api refresh token
      const res = await authApi.refreshToken();

      setToken(res.accessToken as string);
      return true;
    } catch (error) {
      deleteToken();
      return false;
    }
  };

  const setRefreshTokenTimeout = (delay: number) => {
    // 5s before token expires
    refreshTokenTimeoutId = window.setTimeout(getRefreshToken, delay * 1000 - 5000);
  };

  return { getToken, setToken, getRefreshToken, deleteToken, getUserId };
};

export default JWTManager();
