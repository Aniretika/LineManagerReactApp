import { LogLevel } from "@azure/msal-browser";

const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0;

 export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_SignUpSignIn",
        forgotPassword: "B2C_1_PasswordReset",
        editProfile: "B2C_1_ProfileEdit"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://linemanagergroup.b2clogin.com/linemanagergroup.onmicrosoft.com/B2C_1_SignUpSignIn",
        },
        signUp: {
            authority: "https://linemanagergroup.b2clogin.com/linemanagergroup.onmicrosoft.com/B2C_1_SignUp"
        },
        forgotPassword: {
            authority:
            {
               scopes: ["https://linemanagergroup.b2clogin.com/linemanagergroup.onmicrosoft.com/B2C_1_PasswordReset"]
            },
        },
        editProfile: {
            authority: "https://linemanagergroup.b2clogin.com/linemanagergroup.onmicrosoft.com/B2C_1_ProfileEdit"
        }
    },
    authorityDomain: "linemanagergroup.b2clogin.com"
}

export const msalConfig = {
    auth: {
        clientId: "31a7caaa-5ba6-4a63-b598-febe8bed51c9",
        authority: b2cPolicies.authorities.signUpSignIn.authority,
        knownAuthorities: [b2cPolicies.authorityDomain],
        redirectUri: "/",
        },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE || isEdge || isFirefox
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

export const signUpRequest = {
    scopes: ["https://linemanagergroup.b2clogin.com/linemanagergroup.onmicrosoft.com/B2C_1_SignUp"],
  };
  
export const loginRequest = {
    scopes: ['https://linemanagergroup.onmicrosoft.com/essential/api/position.read',
    'https://linemanagergroup.onmicrosoft.com/essential/api/position.write',
    'https://linemanagergroup.onmicrosoft.com/essential/api/lines.write',
    'https://linemanagergroup.onmicrosoft.com/essential/api/lines.read']
};

export const apiConfig = {
    scopes: ['https://linemanagergroup.onmicrosoft.com/essential/api/position.read',
    'https://linemanagergroup.onmicrosoft.com/essential/api/position.write',
    'https://linemanagergroup.onmicrosoft.com/essential/api/lines.write',
    'https://linemanagergroup.onmicrosoft.com/essential/api/lines.read'],
    uri: "http://localhost:7273/"
};
