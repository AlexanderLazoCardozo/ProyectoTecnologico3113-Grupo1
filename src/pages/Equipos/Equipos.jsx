import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebaseApp from "../../firebase/credenciales";
import NavTab from "../../components/NavTab";
import { Button, Card, Container } from "semantic-ui-react";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import DataTable from "react-data-table-component";
import NuevoEquipo from "./NuevoEquipo";
const firestore = getFirestore(firebaseApp);

const Equipos = ({ user }) => {
  const [dataEquipos, setDataEquipos] = useState([]);

  const getDataEquipos = async () => {
    try {
      const q = query(collection(firestore, "EquipoAlmacen"));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const docsMap = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setDataEquipos(docsMap);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavTab user={user}>
      <Card
        style={{
          margin: "20px",
          width: "auto",
          padding: "20px",
          fontFamily: "Poppins",
        }}
      >
        <div>
          <h1> Inventario </h1>

          <Button color="yellow" onClick={getDataEquipos}>
            Conectar
          </Button>
          <NuevoEquipo />

          <br />
          <Container style={{ maxHeight: "auto", overflowY: "auto" }}>
            <DataTable
              columns={[
                {
                  name: "NumSerie",
                  selector: (row) => row.numSerie,
                  sortable: true,
                },
                {
                  name: "CodigoProducto (Grupo)",
                  selector: (row) => row.codigoProducto,
                  sortable: true,
                },
                {
                  name: "Fecha Creacion",
                  selector: (row) => row.fechaCreacion,
                  sortable: true,
                },
                {
                  name: "Status",
                  selector: (row) => row.status,
                  sortable: true,
                },
                {
                  name: "Ultimo Cliente Asignado",
                  selector: (row) => row.UltimoPoseedor,
                  sortable: true,
                },
              ]}
              data={dataEquipos}
              pagination
            />
          </Container>
        </div>
      </Card>
    </NavTab>
  );
};

export default Equipos;
