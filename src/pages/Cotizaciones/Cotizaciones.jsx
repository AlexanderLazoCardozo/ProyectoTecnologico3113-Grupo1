import React, { useEffect, useState } from "react";
import NavTab from "../../components/NavTab";
import firebaseApp from "../../firebase/credenciales";
import {
  collection,
  getDocs,
  getFirestore,
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
import Buscador from "../../components/Buscador";

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
      const snapData = await getDocs(conectarData);

      const docsMap = snapData.docs.map((doc) => {
        return doc.data();
      });

      setDataCotizaciones(docsMap);
      setCotizacionesFiltradas(docsMap);
      toast.success("Datos obtenidos exitosamente.");
    } catch (error) {
      console.log(error);
    }
  };

  //  Facturación
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

  // Cliente Dinámico
  const [searchClienteRUC, setSearchClienteRUC] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSearch = async (term) => {
    setSearchClienteRUC(term.toUpperCase());
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "DataComercialOficial"),
        where("documento", "==", term)
      )
    );
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSearchResults(results);
    if (results.length > 0) {
      handleSelectClient(results[0]);
    } else {
      handleSelectClient();
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  // Inventario Dinámico
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const conectarEquipos = query(collection(firestore, "EquipoInventory"));
        const snapEquipos = await getDocs(conectarEquipos);

        const equiposList = snapEquipos.docs.map((doc) => ({
          id: doc.id,
          codigoEquipo: doc.data().CodigoEquipo,
          stock: doc.data().Stock,
          direccion: doc.data().Direccion,
        }));

        setEquipos(equiposList);
      } catch (error) {
        console.error("Error fetching equipos:", error);
      }
    };

    fetchEquipos();
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

  const [equiposSalida, setEquiposSalida] = useState([]);

  const handleConfirmSalida = async () => {
    try {
      if (searchResults.length === 0) {
        // Generar un CodigoCli respectivo si el cliente no existe
        const q = query(
          collection(firestore, "DataComercialOficial"),
          orderBy("CodigoCli", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        let lastCodigoCli = "CLI0000";

        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[0];
          lastCodigoCli = lastDoc.data().CodigoCli;
        }

        const newCodigoCli = incrementarCodigoCli(lastCodigoCli);
        const batch = writeBatch(firestore);
      } else {
        let ClienteUID = searchResults.UID;
        console.log("si existe");
      }
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
          <CotizacionesTabla data={cotizacionesFiltradas} facturar={facturar} />
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
