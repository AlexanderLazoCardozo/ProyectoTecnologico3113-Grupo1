import { Button, Divider, Grid, Modal, Segment , Header, Icon} from "semantic-ui-react";
import React, { useState } from 'react';

const CotizacionesTabla = ({ data }) => {

  const [modalOpenDetalleEquipo, setModalOpenDetalleEquipo] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null); 



  return (

    <div>
      <Modal
          open={modalOpenDetalleEquipo}
          onClose={() => setModalOpenDetalleEquipo(false)}
          size='tiny'
          dimmer='blurring'
      >
      <Modal.Header>
        <Header as='h2' style={{ textAlign: 'center', backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd', margin: 0 }}>
          Detalles Productos
          <Button
            icon='close'
            onClick={() => setModalOpenDetalleEquipo(false)}
            style={{ color: 'red', position: 'absolute', right: '10px', top: '10px', background: 'none' }}
          />
        </Header>
      </Modal.Header>

      <Modal.Content scrolling>
        <Segment raised padded='very'>
          <Grid divided>

            <Grid.Row columns={2}>
              <Grid.Column width={4}>
                <Icon name='archive' size='big' />
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as='h3'>Codigo Equipo</Header>
                <p style={{ fontSize: '1.2em' }}> {equipoSeleccionado?.CodigoEquipo} </p>
              </Grid.Column>
            </Grid.Row>

            <Divider />

            <Grid.Row columns={2}>
              <Grid.Column width={4}>
                <Icon name='cart arrow down' size='big' />
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as='h3'>Descripción</Header>
                <p style={{ fontSize: '1.2em' }}> {equipoSeleccionado?.Descripcion} </p>
              </Grid.Column>
            </Grid.Row>

            <Divider />

            <Grid.Row columns={2}>
              <Grid.Column width={4}>
                <Icon name='dollar sign' size='big' />
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as='h3'>Precio Unitario</Header>
                <p style={{ fontSize: '1.2em' }}>S/. {equipoSeleccionado?.Precio} </p>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Segment>
      </Modal.Content>
    </Modal>

    <table>
      <thead>
        <tr>
          <th>Codigo de Producto</th>
          {/* <th>Nombre del Producto</th> */}
          <th>Descripcion del Producto</th>
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
