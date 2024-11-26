import React, { useState, useEffect } from "react";
import NavTab from "../../components/NavTab";
import { Card, Container, Header, Input, Button } from "semantic-ui-react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import firebaseApp from "../../firebase/credenciales";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tabla from "./Tabla";

const firestore = getFirestore(firebaseApp);

const Inventario = ({ user }) => {
  const [dataInventory, setDataInventory] = useState([]);

  useEffect(() => {
    toast.info("Conectando base...");

    const conectarData = query(collection(firestore, "EquipoInventory"));

    const unsubscribe = onSnapshot(conectarData, (snapshot) => {
      const docsMap = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDataInventory(docsMap);
      console.log("Inventario (realtime):", docsMap);
      toast.success("Datos obtenidos exitosamente.");
    });

    return () => unsubscribe(); // Cleanup al desmontar el componente
  }, []);

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Inventario</Header>
        <div>
          {/* 
            Espacio para la funcionalidad de búsqueda:
            <Input
              placeholder="Buscar en inventario..."
              value={busquedaInventario}
              onChange={(e) => setBusquedaInventario(e.target.value)}
              className="margen-derecho"
            /> 
          */}
          {/* 
            Espacio para agregar un nuevo equipo:
            <Button
              color="black"
              onClick={handleNuevo}
              style={{ marginLeft: "10px" }}
            >
              Nuevo
            </Button>
          */}
        </div>
        <br />
        <Container>
          <Tabla data={dataInventory} />
        </Container>
      </Card>
      <ToastContainer />
    </NavTab>
  );
};

export default Inventario;
