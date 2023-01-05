import { Button, Container, Menu } from "semantic-ui-react";
import { SignInButton } from "./submitButton";

function Navigation(){

    return(
        <>
         <Menu inverted fixed='top'>
            <Container style={{width: '40%'}}>

                <Menu.Item>
                   <SignInButton/>
                </Menu.Item>
               
            </Container>
        </Menu>
        </>
    )
}

export default Navigation;