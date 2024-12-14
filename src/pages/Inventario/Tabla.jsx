import {
  Button,
  Divider,
  Grid,
  Modal,
  Segment,
  Header,
  Icon,
} from "semantic-ui-react";
import React, { useState } from "react";
import ShowGrayF from "../../components/showsModels/ShowGrayF";
import ShowRedF from "../../components/showsModels/ShowRedF";
import ShowTwooDoorsFridge from "../../components/showsModels/ShowTwoDoorsFridge";
import ShowTableF from "../../components/showsModels/ShowTableF";
import ShowPinkF from "../../components/showsModels/ShowPinkF";

const CotizacionesTabla = ({ data }) => {
  const [modalOpenDetalleEquipo, setModalOpenDetalleEquipo] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const modelosEquipo = {
    "VE-28-V1": <ShowTwooDoorsFridge />,
    "CR-23-A-V1": <ShowRedF />,
    "MTR-48-FP-V1": <ShowTableF />,
    "CR-23-A-SSA-V1": <ShowPinkF />,
    "FROSTER-280-PVP-V1": <ShowGrayF />,
  };

  return (
    <div>
      <Modal
        open={modalOpenDetalleEquipo}
        onClose={() => setModalOpenDetalleEquipo(false)}
        size="tiny"
        dimmer="blurring"
        style={{ maxWidth: "70vw", width: "auto" }}
      >
        <Modal.Header>
          <Header
            as="h2"
            style={{
              textAlign: "center",
              backgroundColor: "#f0f0f0",
              borderBottom: "2px solid #ddd",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              position: "relative",
              margin: 0,
            }}
          >
            Detalles Equipo
            <Button
              icon="close"
              onClick={() => setModalOpenDetalleEquipo(false)}
              style={{
                color: "red",
                position: "absolute",
                right: "10px",
                top: "10px",
                background: "none",
              }}
            />
          </Header>
        </Modal.Header>

        <Modal.Content>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <Segment style={{ flex: "1", margin: "0px" }} raised padded="very">
              <Grid divided>
                <Grid.Row columns={2}>
                  <Grid.Column width={4}>
                    <Icon name="archive" size="big" />
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Header as="h3">Codigo Equipo</Header>
                    <p style={{ fontSize: "1.2em" }}>
                      {" "}
                      {equipoSeleccionado?.CodigoEquipo}{" "}
                    </p>
                  </Grid.Column>
                </Grid.Row>

                <Divider />

                <Grid.Row columns={2}>
                  <Grid.Column width={4}>
                    <Icon name="cart arrow down" size="big" />
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Header as="h3">Descripción</Header>
                    <p style={{ fontSize: "1.2em" }}>
                      {" "}
                      {equipoSeleccionado?.Descripcion}{" "}
                    </p>
                  </Grid.Column>
                </Grid.Row>

                <Divider />

                <Grid.Row columns={2}>
                  <Grid.Column width={4}>
                    <Icon name="dollar sign" size="big" />
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Header as="h3">Precio Unitario</Header>
                    <p style={{ fontSize: "1.2em" }}>
                      S/. {equipoSeleccionado?.Precio}{" "}
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>

            {/* Visualizacion de Modelos */}
            <Segment
              style={{
                flex: "1",
                filter: "brightness(1)",
                padding: "0px",
                margin: "0px",
              }}
            >
              {/* Colocar Models */}

              {modelosEquipo[equipoSeleccionado?.CodigoEquipo]}
            </Segment>
          </div>
        </Modal.Content>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>Codigo de Equipo</th>
            {/* <th>Nombre del Producto</th> */}
            <th>Descripcion del Equipo</th>
            <th>Cantidad Disponible</th>
            <th>Precio Unitario</th>

            {/* Este termino era segun la cantidad solicitada, no un valor
          de por si.
          <th>Valor Total</th> 
          */}
            {/* Este campo seria para documentos singulares
          no para uno que representa a varios productos
          <th>Fecha de Ingreso</th> 
          */}
            {/* <th>Estado</th> */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.CodigoEquipo}</td>
              {/* <td>{item.nombreProducto}</td> */}
              <td>{item.Descripcion}</td>
              <td>{item.Stock}</td>
              <td>{item.Precio}</td>
              {/* <td>{item.valorTotal}</td> */}
              {/* <td>{item.fechaIngreso}</td> */}
              {/* <td>{item.estado}</td> */}
              <td>
                {/* //Modal a Integrar de Productos */}
                <Button
                  color="black"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    setEquipoSeleccionado(item);
                    setModalOpenDetalleEquipo(true);
                  }}
                >
                  Ver Detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CotizacionesTabla;
