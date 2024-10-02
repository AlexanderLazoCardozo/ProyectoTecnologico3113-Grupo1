import { useState } from "react";
import "./App.css";
import { Button, Container, Header, Input } from "semantic-ui-react";
import "./Clientes.css";
import MOCK_DATA from "./MOCK_DATA";

// modificar esto con llamada al backend
async function buscar(busqueda) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 1000);
  });
}

function Clientes() {
  const [busqueda, setBusqueda] = useState("");
  const [contenido, setContenido] = useState([]);

  async function onClick() {
    const resultado = await buscar(busqueda);
    setContenido(resultado);
  }

  return (
    <Container textAlign="left">
      <Header as="h1">Clientes</Header>
      <Container>
        <Input
          className="margen-derecho"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button color="yellow" onClick={onClick}>
          Buscar
        </Button>
      </Container>
      {contenido.length > 0 ? (
        <Container className="contenedor-busqueda">
          <Container className="inline-item margen-derecho">
            {
              /* Ejemplo de como renderizar data, modificar de acuerdo a necesidades */
              contenido.map((cliente) => {
                return (
                  <p>
                    {cliente.nombre} {cliente.apellido}
                  </p>
                );
              })
            }
          </Container>
          <Container className="inline-item">
            {
              /* Ejemplo de como renderizar data, modificar de acuerdo a necesidades */
              contenido.map((cliente) => {
                return (
                  <p>
                    {cliente.nombre} {cliente.apellido}
                  </p>
                );
              })
            }
          </Container>
        </Container>
      ) : null}
    </Container>
  );
}

export default Clientes;
