
import NavBar from "./NavBar";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container } from "rsuite";
import { SignInButton } from "./SignInButton";
import '../../styles/pageLayoutStyle.css'
import Footer from "../../App/layouts/Footer";

export const PageLayout = (props) => {

    return (
        <>
            <NavBar />
            <UnauthenticatedTemplate>
            <Container style={{ position: 'relative', height: '80vh'}}>
                <div className="welcome-page">
                    <h1>Welcome to the Line Manager!</h1>
                        <h4>Before you start, please login</h4>
                    <SignInButton/>
                </div>
            </Container>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {props.children}
            </AuthenticatedTemplate>
            <Footer/>
        </>
    );
};