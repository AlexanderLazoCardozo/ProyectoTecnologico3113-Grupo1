import React, { useEffect, useState } from "react";
import NavTab from "../../components/NavTab";
import firebaseApp from "../../firebase/credenciales";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  doc,
  deleteDoc,
  onSnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import { Button, Card, Container, Header } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CotizacionesTabla from "./Tabla";
import NuevaCotizacion from "./NuevaCotizacion";
import NuevaFactura from "../Facturas/NuevaFactura";
import Buscador from "../../components/Buscador";
import { update } from "lodash";

const firestore = getFirestore(firebaseApp);

const Cotizaciones = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [dataCotizaciones, setDataCotizaciones] = useState([]);
  const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const getDataCotizaciones = async () => {
    try {
      toast.info("Conectando base...");
      const conectarData = query(
        collection(firestore, "DataCotizaciones"),
        orderBy("NumeroCotizacion", "desc")
      );

      const snap = onSnapshot(conectarData, (querySnapshot) => {
        const docsMap = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setDataCotizaciones(docsMap);
        setCotizacionesFiltradas(docsMap);
      });

      toast.success("Datos obtenidos exitosamente.");
    } catch (error) {
      console.log(error);
    }
  };

  const facturar = (factura) => {
    setSelectedFactura(factura);
  };

  const closeFacturaForm = () => {
    setSelectedFactura(null);
  };

  const handleUpdateStatus = () => {
    console.log("Estado de la cotización actualizado");
    getDataCotizaciones();
  };

  const EliminarCotizacion = async (cotizacion) => {
    try {
      const cotizacionRef = doc(firestore, "DataCotizaciones", cotizacion.UID);
      await deleteDoc(cotizacionRef);

      console.log("cotizacion", cotizacion.Equipos);

      cotizacion.Equipos.forEach(async (equipo) => {
        console.log("equipoCodigo", equipo.codigoEquipo);

        const equipoRef = query(
          collection(firestore, "EquipoInventory"),
          where("CodigoEquipo", "==", equipo.codigoEquipo)
        );

        const querySnapshot = await getDocs(equipoRef);
        let dataEquipo = [];

        querySnapshot.forEach((doc) => {
          console.log("equipoRef", doc.data());
          dataEquipo = [doc.id, doc.data().Stock];
        });

        updateDoc(doc(firestore, "EquipoInventory", dataEquipo[0]), {
          Stock: dataEquipo[1] + equipo.cantidad,
        });
      });

      toast.success("Cotización eliminada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar la cotización:", error);
      toast.error("Hubo un error al eliminar la cotización.");
    }
  };

  return (
    <NavTab user={user}>
      <Card
        style={{
          margin: "20px",
          width: "auto",
          padding: "20px",
        }}
      >
        <Header as="h1">Cotizaciones</Header>
        <div>
          <Button color="yellow" onClick={getDataCotizaciones}>
            Conectar Cotizaciones
          </Button>
          <Buscador
            campo="NumeroCotizacion"
            lista={dataCotizaciones}
            setListaFiltrada={setCotizacionesFiltradas}
            placeholder="Buscar en Cotizaciones..."
          />
          <NuevaCotizacion />
        </div>
        <br />
        <Container style={{ maxHeight: "400px", overflowY: "auto" }}>
          <CotizacionesTabla
            data={dataCotizaciones}
            facturar={facturar}
            Eliminar={EliminarCotizacion}
          />
        </Container>
        {selectedFactura && (
          <NuevaFactura
            factura={selectedFactura}
            onClose={closeFacturaForm}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </Card>
    </NavTab>
  );
};

export default Cotizaciones;
