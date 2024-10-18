import React, { useState } from "react";
import NavTab from "../../components/NavTab";
import { Card, Container, Header, Input, Button } from "semantic-ui-react";
import CotizacionesTabla from "./Tabla";
import data from "./mockData.json";

const Cotizaciones = ({ user }) => {
  const [busquedaCotizacion, setBusquedaCotizacion] = useState("");

  const handleBuscar = () => {
    // Aquí puedes implementar la lógica para buscar cotizaciones
    console.log("Buscar cotización:", busquedaCotizacion);
  };

  const handleNuevo = () => {
    // Aquí puedes implementar la lógica para crear una nueva cotización
    console.log("Crear nueva cotización");
  };
  console.log({ data });
  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Container textAlign="left">
          <Header as="h1">Cotizaciones</Header>
          <Container>
            <Input
              placeholder="Buscar cotización..."
              value={busquedaCotizacion}
              onChange={(e) => setBusquedaCotizacion(e.target.value)}
              className="margen-derecho"
            />
            <Button color="yellow" onClick={handleBuscar}>
              Buscar
            </Button>
            <Button
              color="black"
              onClick={handleNuevo}
              style={{ marginLeft: "10px" }}
            >
              Nuevo
            </Button>
          </Container>
          <Container>
            <CotizacionesTabla data={data} />
          </Container>
        </Container>
      </Card>
    </NavTab>
  );
};

export default Cotizaciones;
