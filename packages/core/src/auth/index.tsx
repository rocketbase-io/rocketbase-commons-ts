import axios, {AxiosInstance} from "axios";
import * as React from "react";

export interface DefaultTokenParsed extends Record<string, unknown> {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  username?: string;
}

export interface TokenParsed extends Record<string, unknown>, DefaultTokenParsed {
}

export interface DefaultTokenService {
  tokenParsed?: () => TokenParsed;
  hasRole?: (roles: string[]) => boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface TokenService extends DefaultTokenService {
  isLoggedIn: () => boolean;
  token: () => string;
  updateToken: (successCallback: () => void) => void;
}

export interface AuthContextProps extends TokenService {
  axiosClient: AxiosInstance;
  baseUrl: string;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error("Please use a AuthContext");
  }

  return authContext;
};

export interface AuthContextProviderProps {
  children: React.ReactNode;
  tokenService: TokenService;
  baseUrl: string;
}

export const AuthContextProvider = ({children, tokenService, baseUrl}: AuthContextProviderProps) => {
  const [axiosClient] = React.useState(() => {
    const _axios = axios.create();
    _axios.interceptors.request.use((config) => {
      if (tokenService.isLoggedIn()) {
        const cb = () => {
          config.headers!.Authorization = `Bearer ${tokenService.token()}`;
          return Promise.resolve(config);
        };
        return tokenService.updateToken(cb);
      }
    });
    return _axios;
  });

  return (
    <AuthContext.Provider
      value={React.useMemo(
        () => ({
          axiosClient,
          baseUrl,
          ...tokenService
        }),
        [axiosClient, baseUrl, tokenService]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};
