import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import firebaseApp from "../../firebase/credenciales";
import {
  getDocs,
  collection,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import DataTable from "react-data-table-component";
import {
  Container,
  Grid,
  Segment,
  Header,
  Icon,
  Input,
  Card,
  List,
  Button,
  Modal,
  Divider,
} from "semantic-ui-react";
import NavTab from "../../components/NavTab";

const firestore = getFirestore(firebaseApp);

const TablaFacturas = ({ user }) => {
  const [facturasGenerales, setFacturasGenerales] = useState([]);

  const facturasCall = async () => {
    const query = collection(firestore, "FacturacionOficial");

    const getQuery = await getDocs(query);

    getQuery.forEach((doc) => {
      setFacturasGenerales((prev) => [...prev, doc.data()]);
    });

    console.log(facturasGenerales);
  };

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Facturas</Header>
        <div>
          <Button color="yellow" onClick={facturasCall}>
            Conectar Facturas
          </Button>
        </div>
        <br />
        <Container style={{ maxHeight: "auto", overflowY: "auto" }}>
          <DataTable
            columns={[
              {
                name: "N° Factura",
                selector: (row) => row.NumeroFactura,
                sortable: true,
              },
              {
                name: "N° Cotizacion",
                selector: (row) => row.NumeroCotizacion,
                sortable: true,
              },
              {
                name: "Cliente",
                selector: (row) => row.Cliente.CodigoCli,
                sortable: true,
              },
              {
                name: "MontoTotal",
                selector: (row) => row.MontoTotal,
                sortable: true,
              },
              {
                name: "Fecha Emision",
                selector: (row) => row.FechaEmision,
                sortable: true,
              },
              {
                name: "Fecha Vencimiento",
                selector: (row) => row.FechaEmision,
                sortable: true,
              },
            ]}
            data={facturasGenerales}
            pagination
          />
        </Container>
      </Card>
    </NavTab>
  );
};

export default TablaFacturas;
