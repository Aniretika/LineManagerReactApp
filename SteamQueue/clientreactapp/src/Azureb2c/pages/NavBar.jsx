import { useEffect } from 'react';
import '../../styles/navBarStyles.css';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Menu } from 'semantic-ui-react';
import '../../styles/navBarStyles.css';
import { useStore } from '../../App/stores/store';
import { useMsal } from "@azure/msal-react";
import { AuthenticatedTemplate } from '@azure/msal-react';
import { observer } from 'mobx-react-lite';
import { useHistory } from "react-router-dom";

const NavBar = () => {
    const {lineStore} = useStore();
    const { instance } = useMsal();
    const { lineList, getLineList, checkUser, userName } = lineStore;
    const history = useHistory();
    useEffect(() => {
        getLineList();
      }, []);
      
      const getAccountName = () => 
      {
        const accountInfo = instance.getActiveAccount();
        checkUser(accountInfo);
        return userName;
      }
    return (
        <>
            <Menu inverted fixed='top'>
            <Container style={{width: '40%'}}>
                <Menu.Item header exact to='/' as={NavLink}>
                    <img src='https://cdn-icons-png.flaticon.com/512/2397/2397830.png' alt='logo' style={{marginRight: '10px'}}/>
                    Line Manager
                </Menu.Item>
                <AuthenticatedTemplate>
                <Menu.Item header>
                <Dropdown text='My lines'>
                    <Dropdown.Menu>
                        {lineList.map(line => (
                            <Dropdown.Item 
                            exact='true'
                            to={`/Line/${line.id}`}
                            as={Link}
                            text={line.lineName}
                            key={line.id} />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                </Menu.Item>
                <Menu.Item>
                    <Button positive className='create-line-button' content='Create Line' as={NavLink} to='/CreateLine' />
                </Menu.Item>
                </AuthenticatedTemplate>
                <Menu.Item position='right'>
                    <Button positive className='telegram-button' onClick={() => window.open("https://t.me/booking_40a_bot", "_blank")}>Try it in telegram bot</Button>
                </Menu.Item>
                <AuthenticatedTemplate>
                <Menu.Item position='right'>
                <Dropdown pointing='top left' icon='user' text={getAccountName()}>
                        <Dropdown.Menu>
                            {/* <Dropdown.Item 
                             as={NavLink}
                             exact="true" 
                             to='/'
                             text='Discover lines'
                             icon='list alternate outline' /> */}
                            <Dropdown.Item
                             onClick={() => {
                                history.push(`/`);
                                instance.logoutRedirect();
                            }}
                             text='Logout' 
                             icon='power' />
                        </Dropdown.Menu>
                </Dropdown>
                </Menu.Item>
                </AuthenticatedTemplate>
            </Container>
        </Menu>
        </>
    );
};

export default observer(NavBar);