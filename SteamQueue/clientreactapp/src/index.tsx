import React from 'react';
import './index.css';
import { store, StoreContext } from './App/stores/store';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './Azureb2c/authConfig';
import App from './App';

// MSAL imports
import { EventType } from "@azure/msal-browser";
import ReactDOM from 'react-dom';

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS
      ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ||
      event.eventType === EventType.SSO_SILENT_SUCCESS
    ) {
    const account = event!.payload!['account'];
    msalInstance.setActiveAccount(account);
  }
});

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
      <App pca={msalInstance} />
    </BrowserRouter>
  </StoreContext.Provider>,
  document.getElementById('root')
);
