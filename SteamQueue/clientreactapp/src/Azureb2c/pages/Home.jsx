import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { Link as RouterLink } from "react-router-dom";

import Stack from '@mui/material/Stack';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";

export function Home(props) {
  const { instance } = useMsal();
  // tokenClaims={instance.getActiveAccount().idTokenClaims}
  return (
      <>
          <AuthenticatedTemplate>
          <Typography id="interactionStatus" variant="h6">
              <div>{props.status}</div>
          </Typography>
          <Stack direction="column" spacing={2}>
          <ButtonGroup orientation="vertical">
              <Button component={RouterLink} to="/profile" variant="contained" color="primary" id="callApiButton">Call Hello API</Button>
            </ButtonGroup>
            <Typography variant="body1">Claims in your ID token are shown below: </Typography>
          </Stack>
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
          <div>Please sign-in to see your profile information.</div>
            
          </UnauthenticatedTemplate>
      </>
  );
}