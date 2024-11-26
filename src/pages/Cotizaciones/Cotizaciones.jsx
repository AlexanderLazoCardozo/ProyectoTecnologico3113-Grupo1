import React, { useEffect, useState } from "react";
import NavTab from "../../components/NavTab";
import firebaseApp from "../../firebase/credenciales";
import {
  collection,
  onSnapshot,
  getFirestore,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Button, Card, Container, Header } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CotizacionesTabla from "./Tabla";
import NuevaCotizacion from "./NuevaCotizacion";
import NuevaFactura from "../Facturas/NuevaFactura";
import Buscador from "../../components/Buscador";
import VencimientoCotizaciones from "../../components/TiempoCotizacion";

const firestore = getFirestore(firebaseApp);

const Cotizaciones = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [dataCotizaciones, setDataCotizaciones] = useState([]);
  const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

  useEffect(() => {
    toast.info("Conectando base...");

    const conectarData = query(
      collection(firestore, "DataCotizaciones"),
      orderBy("NumeroCotizacion", "desc")
    );

    const unsubscribe = onSnapshot(conectarData, (snapshot) => {
      const docsMap = snapshot.docs.map((doc) => doc.data());
      setDataCotizaciones(docsMap);
      console.log("Cotizaciones (realtime):", docsMap);
      toast.success("Datos obtenidos exitosamente.");
    });

    return () => unsubscribe();
  }, []);

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
      const cotizacionRef = doc(
        firestore,
        "DataCotizaciones",
        cotizacion.NumeroCotizacion
      );
      await deleteDoc(cotizacionRef);

      const nuevasCotizaciones = dataCotizaciones.filter(
        (item) => item.NumeroCotizacion !== cotizacion.NumeroCotizacion
      );
      setDataCotizaciones(nuevasCotizaciones);

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
