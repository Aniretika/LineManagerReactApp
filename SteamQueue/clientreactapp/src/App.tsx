import { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import '../src/styles/appStyles.css';
import Grid from "@mui/material/Grid";
import { EventType } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { b2cPolicies } from "./Azureb2c/authConfig";
import { CustomNavigationClient } from "./Azureb2c/NavigationClient";
import LineTable from "./App/features/LineTable";
import CreateLine from "./App/features/CreateLine";
import { PageLayout } from "./Azureb2c/pages/PageLayout";
import MainLayout from "./App/features/MainLayout";
import { Container } from "semantic-ui-react";

function App({ pca }) {
  return (
    <ClientSideNavigation pca={pca}>
      <MsalProvider instance={pca}>
        <PageLayout>
          <Grid container justifyContent="center">
            <Pages />
          </Grid>
        </PageLayout>
      </MsalProvider>
    </ClientSideNavigation>
  );
}

function ClientSideNavigation({ pca, children }) {
  const navigate = useHistory();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    console.log('app tsx');
    setFirstRender(false);
  }, []);

  if (firstRender) {
    return null;
  }

  return children;
}

function Pages() {
  const { instance } = useMsal();

  useEffect(() => {
    console.log('app tsx');
      const callbackId = instance.addEventCallback((event) => {
        if ((event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) && event.payload.account) {

            if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile) {

              const originalSignInAccount = instance.getAllAccounts()
                  .find(account =>
                    account.idTokenClaims!.oid === event.payload.idTokenClaims.oid
                    &&
                    account.idTokenClaims!.sub === event.payload.idTokenClaims.sub
                    &&
                    account.idTokenClaims!['tfp'] === b2cPolicies.names.signUpSignIn
                  );
              
              let signUpSignInFlowRequest = {
                  authority: b2cPolicies.authorities.signUpSignIn.authority,
                  account: originalSignInAccount
              };
      
              instance.ssoSilent(signUpSignInFlowRequest);
            }
          }
      });

      return () => {
          if (callbackId) {
              instance.removeEventCallback(callbackId);
          }
      }
  }, []);

  return (
    <Switch>
      <Container style={{paddingTop: '3em'}}>
        <Route path='/CreateLine' component={CreateLine}/>
        <Route path='/Line/:id' component={LineTable}/>    
        <Route exact path="/"component={MainLayout}/>
      </Container>
    </Switch>
  )
}

export default App;
