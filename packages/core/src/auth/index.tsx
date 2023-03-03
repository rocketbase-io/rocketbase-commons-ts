import axios, {AxiosInstance, AxiosInterceptorOptions, AxiosRequestConfig} from "axios";
import * as React from "react";

export interface TokenService  {
  isLoggedIn: () => boolean;
  token: () => string;
  updateToken: () => Promise<string>;
}

export interface AuthContextProps extends TokenService {
  axiosClient: AxiosInstance;
  baseUrl: (key?: string) => string;
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
  baseUrl: string | Record<string, string>;
  axiosConfigure?: (axios: AxiosInstance, tokenService: TokenService) => AxiosInstance;
}

const bearerInterceptor = (axios: AxiosInstance, tokenService: TokenService) => {
  axios.interceptors.request.use(async (config) => {
    if (tokenService.isLoggedIn()) {
      await tokenService.updateToken();
      config.headers!.Authorization = `Bearer ${tokenService.token()}`;
      return config;
    }
    return config;
  });
  return axios;
}

export const AuthContextProvider = ({children, tokenService, baseUrl, axiosConfigure}: AuthContextProviderProps) => {
  const [axiosClient] = React.useState(() => {
    const _axios = axios.create();
    return axiosConfigure ? axiosConfigure(_axios, tokenService) : bearerInterceptor(_axios, tokenService)
  });

  const url = (key?: string) => {
    if (key === undefined && typeof baseUrl === 'string') {
      return baseUrl;
    } else if (key !== undefined && typeof baseUrl !== 'string' && key in baseUrl) {
      return baseUrl[key];
    } else {
      throw new Error(`mismatch in configuration -> key: ${key} and baseUrl: ${JSON.stringify(baseUrl)}`)
    }
  }

  return (
    <AuthContext.Provider
      value={React.useMemo(
        () => ({
          axiosClient,
          baseUrl: url,
          ...tokenService
        }),
        [axiosClient, baseUrl, tokenService]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};
