import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

export default function Footer(){
    return(
        <Menu inverted fixed='bottom' style={{height: '70px'}}>
            <Container style={{padding: '20px', width: '45%'}}>
            {/* <div className="content" >
                <a className='header' href="https://www.w3schools.com/"
                style={{color: 'white'}}>Register on telegram bot!</a>
            </div> */}
            </Container>
        </Menu>
    )
}