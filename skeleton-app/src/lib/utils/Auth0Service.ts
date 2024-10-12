import type { Auth0Client, User } from "@auth0/auth0-spa-js";
import { createAuth0Client } from "@auth0/auth0-spa-js";

const isDevelopment = (import.meta.env.MODE as string) === "development";

class Auth0Service {
  private auth0Client: Auth0Client | null = null;
  private rootUrl: string = "";

  constructor() {}

  public async init(rootUrl: string): Promise<void> {
    this.rootUrl = rootUrl;
    if (this.auth0Client !== null) return;
    this.auth0Client = await createAuth0Client({
      domain: "okmethod.jp.auth0.com",
      clientId: "e1Qsve680BspxZQSGk3RqiwfcYCmy74A",
      authorizationParams: {
        redirect_uri: this.rootUrl,
      },
    });
    console.log("Auth0 client initialized.");
  }

  private get client(): Auth0Client {
    if (!this.auth0Client) {
      throw new Error("Auth0 client is not initialized.");
    }
    return this.auth0Client;
  }

  public async handleRedirectCallback(replaceUrl: string): Promise<void> {
    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");
    if (shouldParseResult) {
      console.log("Parsing redirect...");
      try {
        const result = await this.client.handleRedirectCallback();

        if (result.appState && result.appState.targetUrl) {
          window.location.href = result.appState.targetUrl;
        }

        console.log("Logged in!");
      } catch (err) {
        console.error("Failed to parse redirect:", err);
      }

      window.history.replaceState({}, document.title, replaceUrl);
    }
  }

  public async login(): Promise<void> {
    try {
      await this.client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: this.rootUrl,
        },
      });
    } catch (err) {
      console.error("Failed to login:", err);
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.client.logout({
        logoutParams: {
          returnTo: this.rootUrl,
        },
      });
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    return await this.client.isAuthenticated();
  }

  public async getUser(): Promise<User | null> {
    if (isDevelopment) {
      console.log("Returning test user in development mode.");
      return testUser;
    }
    try {
      const isAuthenticated = await this.isAuthenticated();
      if (!isAuthenticated) {
        console.log("Not authenticated.");
        return null;
      }
      const user = await this.client.getUser();
      return user ?? null;
    } catch (err) {
      console.log("Failed to get user:", err);
      return null;
    }
  }
}

const testUser = {
  email: "okmethod.test@gmail.com",
  email_verified: true,
  family_name: "method",
  given_name: "ok",
  name: "ok method",
  nickname: "okmethod.test",
  picture: "https://lh3.googleusercontent.com/a/ACg8ocJruoli4nsmM_FMpGL2s4CsJHsub642d0lrOCWcVy4QnSlXHg=s96-c",
  sub: "google-oauth2|107275238557152646433",
  updated_at: "2024-10-11T13:14:46.955Z",
};

export default Auth0Service;
