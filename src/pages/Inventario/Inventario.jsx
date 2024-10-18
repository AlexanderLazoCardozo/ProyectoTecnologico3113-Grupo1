import React, { useState } from "react";
import NavTab from "../../components/NavTab";
import { Card, Container, Header, Input, Button } from "semantic-ui-react";
import data from "./mockData.json";
import Tabla from "./Tabla";

const Inventario = ({ user }) => {
  const [busquedaInventario, setBusquedaInventario] = useState("");

  const handleBuscar = () => {
    // Aquí puedes implementar la lógica para buscar en el inventario
    console.log("Buscar en inventario:", busquedaInventario);
  };

  const handleNuevo = () => {
    // Aquí puedes implementar la lógica para crear un nuevo elemento en el inventario
    console.log("Crear nuevo elemento en inventario");
  };

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Container textAlign="left">
          <Header as="h1">Inventario</Header>
          <Container>
            <Input
              placeholder="Buscar en inventario..."
              value={busquedaInventario}
              onChange={(e) => setBusquedaInventario(e.target.value)}
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
            <Tabla data={data} />
          </Container>
        </Container>
      </Card>
    </NavTab>
  );
};

export default Inventario;
