import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import "./Buscador.css";

const Buscador = ({ campo, lista, setListaFiltrada, placeholder }) => {
  const [busqueda, setBusqueda] = useState("");

  if (lista.length === 0) return null;

  return (
    <>
      <Input
        placeholder={placeholder}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="margen-izquierdo"
      />
      <Button
        color="black"
        onClick={() =>
          setListaFiltrada(
            lista.filter((item) => item[campo].includes(busqueda))
          )
        }
        style={{ marginLeft: "10px" }}
      >
        Buscar
      </Button>
    </>
  );
};

export default Buscador;
