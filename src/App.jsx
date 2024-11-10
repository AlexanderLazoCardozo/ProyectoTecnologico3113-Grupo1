import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginNet/Login";
import Home from "./pages/Home";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./firebase/credenciales";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Clientes from "./pages/Clients/Clientes";
import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Cotizaciones from "./pages/Cotizaciones/Cotizaciones";
import Inventario from "./pages/Inventario/Inventario";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TablaFacturas from "./pages/Facturas/TablaFacturas";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function getRol(uid) {
    const docuRefProvisional = doc(firestore, `usersAndRoles/${uid}`);
    const docuCifradaRoles = await getDoc(docuRefProvisional);

    const infoNombres = docuCifradaRoles.data().nombres;
    const infoRol = docuCifradaRoles.data().rol;

    const dato = [infoNombres, infoRol];
    return dato;
  }

  async function setUserWithFirebaseAndRol(usuarioFirebase) {
    setIsLoading(true);

    getRol(usuarioFirebase.uid)
      .then((dato) => {
        const userData = {
          uid: usuarioFirebase.uid,
          email: usuarioFirebase.email,
          nombres: dato[0],
          rol: dato[1],
        };
        setUser(userData);
        console.log("Datos de rol:", userData);
      })
      .catch((error) => {
        console.error("Error al obtener datos de rol:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUserWithFirebaseAndRol(usuarioFirebase);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/logistica");
    }
  }, [user, navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login isLoading={isLoading} />} />

        {user ? (
          <>
            {user.rol === "Administrador" ? (
              <>
                <Route path="/logistica" element={<Inventario user={user} />} />
                <Route path="/clientes" element={<Clientes user={user} />} />
                <Route
                  path="/cotizaciones"
                  element={<Cotizaciones user={user} />}
                />
                <Route
                  path="/facturas"
                  element={<TablaFacturas user={user} />}
                />
              </>
            ) : (
              <>
                <Route path="/home" element={<Home user={user} />} />
                <Route
                  path="/cotizaciones"
                  element={<Cotizaciones user={user} />}
                />
              </>
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
