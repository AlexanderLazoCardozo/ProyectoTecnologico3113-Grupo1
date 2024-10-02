import React, { useState } from 'react'
import { Card, Header, Tab, Sidebar, Menu, Icon,Image } from 'semantic-ui-react';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { NavLink } from 'react-router-dom'
import firebaseApp from '../firebase/credenciales';
import logoFogel from "./../images/logoFogel.png"

const NavTab = ({children}) => {

    const auth = getAuth(firebaseApp);

    const [sidebarVisible, setSidebarVisible] = useState(true);

    const handleSidebarToggle = () => {
        setSidebarVisible(!sidebarVisible);
      };

      
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
    <Sidebar.Pushable
      style={{ width: '100%', height: '100%' }}
      as={Card}
      className={sidebarVisible ? 'active' : ''}
    >
      <Sidebar
        as={Menu}
        animation="push"
        direction="left"
        icon="labeled"
        inverted
        vertical
        visible={sidebarVisible}
        width="thin"
        style={{ background: 'black'}}
      >
       
        <Menu.Item as={NavLink} to="/home" style={{ fontSize: '14px' }}>
            <Image src={logoFogel} style={{width:"80%", marginLeft:"10%"}}/>
            Home
        </Menu.Item>
      
        <Menu.Item as={NavLink} to="/clientes" style={{ fontSize: '12px' }}>
            <Icon name='users'size='mini' />
            Clientes
        </Menu.Item>
        
        <Menu.Item onClick={() => signOut(auth)} style={{ fontSize: '12px' }}>
            <Icon name='sign-out' size='mini' color='red'/>
            Cerrar Sesión
        </Menu.Item>
        
      </Sidebar>
      
      <Sidebar.Pusher>
            <Icon
              name="bars"
              size="big"
              style={{ cursor: 'pointer', marginTop: '10px', marginLeft:"5px" }}
              onClick={handleSidebarToggle}
            />


            {children}


      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </div>
  )
}

export default NavTab