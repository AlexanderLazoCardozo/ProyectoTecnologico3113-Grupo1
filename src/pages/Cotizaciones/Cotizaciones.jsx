import React, { useEffect, useState } from "react";
import NavTab from "../../components/NavTab";
import firebaseApp from "../../firebase/credenciales";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Button, Card, Container, Header } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CotizacionesTabla from "./Tabla";
import NuevaCotizacion from "./NuevaCotizacion";
import NuevaFactura from "../Facturas/NuevaFactura";
import VencimientoCotizaciones from "../../components/TiempoCotizacion";

const firestore = getFirestore(firebaseApp);

const Cotizaciones = ({ user }) => {
  const [open, setOpen] = React.useState(false);
  const [dataCotizaciones, setDataCotizaciones] = useState([]);
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

  const Facturar = (factura) => {
    setSelectedFactura(factura);
  };

  const closeFacturaForm = () => {
    setSelectedFactura(null);
  };

  const handleUpdateStatus = () => {
    console.log("Estado de la cotización actualizado");
  };

  // Inventario Dinámico
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const conectarEquipos = query(collection(firestore, "EquipoInventory"));

    const unsubscribeEquipos = onSnapshot(conectarEquipos, (snapshot) => {
      const equiposList = snapshot.docs.map((doc) => ({
        id: doc.id,
        codigoEquipo: doc.data().CodigoEquipo,
        stock: doc.data().Stock,
        direccion: doc.data().Direccion,
      }));
      setEquipos(equiposList);
    });

    return () => unsubscribeEquipos();
  }, []);

  const handleSelectChange = (e) => {
    const selectedCodigo = e.target.value;

    const equipo = equipos.find(
      (equipo) => equipo.codigoEquipo === selectedCodigo
    );
    if (equipo) {
      setSelectedEquipo(selectedCodigo);
      setStock(equipo.stock);
    }
  };

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Cotizaciones</Header>
        <div>
          <NuevaCotizacion />
        </div>
        <br />
        <Container style={{ maxHeight: "400px", overflowY: "auto" }}>
          <CotizacionesTabla data={dataCotizaciones} Facturar={Facturar} />
        </Container>
        {selectedFactura && (
          <NuevaFactura
            factura={selectedFactura}
            onClose={closeFacturaForm}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        <VencimientoCotizaciones />
      </Card>
    </NavTab>
  );
};

export default Cotizaciones;
