import React, { useState } from "react";
import NavTab from "../../components/NavTab";
import { Card, Container, Header, Input, Button } from "semantic-ui-react";
import data from "./mockData.json";
import Tabla from "./Tabla";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import firebaseApp from "../../firebase/credenciales";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firestore = getFirestore(firebaseApp);

const Inventario = ({ user }) => {
  const [dataInventory, setDataInventory] = useState([]);

  const getDataInventory = async () => {
    try {
      toast.info("Conectando base...");

      const conectarData = query(collection(firestore, "EquipoInventory"));

      const snapData = await getDocs(conectarData);

      const docsMap = snapData.docs.map((doc) => {
        return doc.data();
      });

      setDataInventory(docsMap);

      console.log("Inventario: ", docsMap);
      toast.success("Datos obtenidos exitosamente.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Inventario</Header>
        <div>
          {/* <Input
              placeholder="Buscar en inventario..."
              // value={busquedaInventario}
              // onChange={(e) => setBusquedaInventario(e.target.value)}
              className="margen-derecho"
            /> */}
          <Button color="yellow" onClick={getDataInventory}>
            Conectar Equipos
          </Button>
          {/* <Button
              color="black"
              onClick={handleNuevo}
              style={{ marginLeft: "10px" }}
            >
              Nuevo
            </Button> */}
        </div>
        <br />
        <Container>
          <Tabla data={dataInventory} />
        </Container>
      </Card>
    </NavTab>
  );
};

export default Inventario;
