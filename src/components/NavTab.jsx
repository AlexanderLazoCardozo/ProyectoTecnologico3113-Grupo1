import React, { useState } from "react";
import {
  Card,
  Header,
  Tab,
  Sidebar,
  Menu,
  Icon,
  Image,
} from "semantic-ui-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { NavLink } from "react-router-dom";
import firebaseApp from "../firebase/credenciales";
import logoFogel from "./../assets/logo.png";

const NavTab = ({ children, user }) => {
  const auth = getAuth(firebaseApp);

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar.Pushable
        style={{ width: "100%", height: "100%" }}
        as={Card}
        className={sidebarVisible ? "active" : ""}
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
          style={{ background: "black" }}
        >
          <Menu.Item as={NavLink} to="/logistica" style={{ fontSize: "14px" }}>
            <Image src={logoFogel} style={{ width: "100%" }} />
            Equipos
          </Menu.Item>
          <Menu.Item as={NavLink} to="/equipos" style={{ fontSize: "14px" }}>
            <Icon name="dolly flatbed" size="mini" />
            Inventario
          </Menu.Item>
          {user.rol != "Administrador" ? (
            <></>
          ) : (
            <>
              <Menu.Item
                as={NavLink}
                to="/clientes"
                style={{ fontSize: "12px" }}
              >
                <Icon name="users" size="mini" />
                Clientes
              </Menu.Item>
            </>
          )}

          <Menu.Item
            as={NavLink}
            to="/cotizaciones"
            style={{ fontSize: "14px" }}
          >
            <Icon name="file alternate" size="mini" />
            Cotizaciones
          </Menu.Item>

          <Menu.Item as={NavLink} to="/facturas" style={{ fontSize: "14px" }}>
            <Icon name="money" size="mini" />
            Facturas
          </Menu.Item>

          <Menu.Item onClick={() => signOut(auth)} style={{ fontSize: "12px" }}>
            <Icon name="sign-out" size="mini" color="red" />
            Cerrar Sesión
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Icon
            name="bars"
            size="big"
            style={{ cursor: "pointer", marginTop: "10px", marginLeft: "5px" }}
            onClick={handleSidebarToggle}
          />

          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export default NavTab;
