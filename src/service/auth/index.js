import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_AAD_CLIENT_ID,
    authority: `${process.env.VUE_APP_AAD_TENANT_NAME}/${process.env.VUE_APP_AAD_TENANT_ID}`,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
    secureCookies: true,
  },
};

const request = {
  scopes: ["api://4793bb1a-a0d2-46ec-8af5-5509bf011a32/user_impersonation"],
};

export default class MsalAuth {
  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.account = undefined;
    this.token = undefined;
  }

  getAccount() {
    return this.account;
  }

  isAuthenticated() {
    return this.account !== undefined;
  }

  async setActiveAccount() {
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];
    this.msalInstance.setActiveAccount(this.account);
    const response = await this.msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  }

  async signIn() {
    await this.msalInstance
      .loginPopup(request)
      .then((data) => {
        const accounts = this.msalInstance.getAllAccounts();
        this.account = accounts[0];
        try {
          this.token = data.accessToken;
          fetch("http://localhost:8000/user/register", {
            method: "get",
            headers: new Headers({
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            }),
          }).catch(() => console.log("error"));
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.error(`error during authentication: ${error}`);
      });
    return this.token;
  }

  async signOut() {
    this.msalInstance
      .logoutPopup({})
      .then(() => {
        this.account = undefined;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
