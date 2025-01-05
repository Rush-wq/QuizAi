interface Auth0Config {
    domain: string;
    clientId: string;
    authorizationParams: {
      redirect_uri: string;
    };
}
  
export const auth0Config: Auth0Config = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || "",
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "",
    authorizationParams: {
        redirect_uri: window.location.origin
    }
};