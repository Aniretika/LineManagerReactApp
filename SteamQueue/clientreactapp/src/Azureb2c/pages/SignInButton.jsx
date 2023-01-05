import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "semantic-ui-react";

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest);
    }

    return (
        <div>
            <Button positive className="login-button" size="big" onClick={() => handleLogin()} color="inherit">Login</Button>
        </div>
    )
};