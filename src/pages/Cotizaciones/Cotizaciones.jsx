import { useEffect, useState } from "react";
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
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { Card, Container, Header } from "semantic-ui-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CotizacionesTabla from "./Tabla";
import NuevaCotizacion from "./NuevaCotizacion";
import NuevaFactura from "../Facturas/NuevaFactura";
import Buscador from "../../components/Buscador";
import VencimientoCotizaciones from "../../components/TiempoCotizacion";

const firestore = getFirestore(firebaseApp);

const Cotizaciones = ({ user }) => {
  const [dataCotizaciones, setDataCotizaciones] = useState([]);
  const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState([]);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  useEffect(() => {
    toast.info("Conectando base...");

    const conectarData = query(
      collection(firestore, "DataCotizaciones"),
      orderBy("NumeroCotizacion", "desc")
    );

    const unsubscribe = onSnapshot(conectarData, (snapshot) => {
      const docsMap = snapshot.docs.map((doc) => doc.data());
      setDataCotizaciones(docsMap);
      setCotizacionesFiltradas(docsMap);
      console.log("Cotizaciones (realtime):", docsMap);
      toast.success("Datos obtenidos exitosamente.");
    });

    return () => unsubscribe();
  }, []);

  const closeFacturaForm = () => {
    setSelectedCotizacion(null);
  };

  const handleUpdateStatus = () => {
    console.log("Estado de la cotización actualizado");
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
            data={cotizacionesFiltradas}
            setSelectedCotizacion={setSelectedCotizacion}
            Eliminar={EliminarCotizacion}
          />
        </Container>
        {selectedCotizacion && (
          <NuevaFactura
            cotizacion={selectedCotizacion}
            onClose={closeFacturaForm}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </Card>
    </NavTab>
  );
};

export default Cotizaciones;
