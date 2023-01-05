import { Button } from "semantic-ui-react";

import { useMsal } from "@azure/msal-react";

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleSignIn = () => {
        instance.loginRedirect({
            scopes: ['lines.read']
        })
    }
    return(
        <Button color="turquoise" onClick={handleSignIn}>Sign In</Button>
    )
}