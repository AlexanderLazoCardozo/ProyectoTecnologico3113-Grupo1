import React, { useState } from 'react';
import { getDocs, collection, getFirestore, query, where } from 'firebase/firestore';
import firebaseApp from "../../firebase/credenciales";
import NavTab from '../../components/NavTab';
import "./../../App.css";
import "./Clientes.css";
import { Container, Grid, Segment, Header, Icon, Input, Card, List, Button, Modal, Divider } from 'semantic-ui-react';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const firestore = getFirestore(firebaseApp);

const Clientes = ({user}) => {
    
    const [datosCli, setDatosCli] = useState([]);
    const [cotizacionesCli, setCotizacionesCli] = useState([])
    const [equiposAdquiridos, setEquiposAdquiridos] = useState([])
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null); 

    const [busquedaCli, setBusquedaCli] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

  const dataCall = async () => {

      try {

        toast.info("Conectando base...")

            //LLamar datos del cliente
            const conectarBase = query(collection(firestore,"DataComercialOficial"), where("CodigoCli","==",busquedaCli ))

            const conectarSnapshot = await getDocs(conectarBase)


            const documentosFind = conectarSnapshot.docs.map((doc) => {

                return doc.data()

            })
            setDatosCli(documentosFind);

            // if (documentosFind.length === 1) {
            //   setClienteSeleccionado(documentosFind[0]);
            // } else {
            //   setClienteSeleccionado(null);
            // }
            
            console.log("Datos del Cliente",documentosFind)

            //LLamar a sus cotizaciones
            const conectarBaseCotiz = query(collection(firestore,"DataCotizaciones"), where("CodigoCli","==",busquedaCli ))

            const conectarSnapshotCotiz = await getDocs(conectarBaseCotiz)


            const documentosFindCotiz = conectarSnapshotCotiz.docs.map((doc) => {

                return doc.data()

            })
            setCotizacionesCli(documentosFindCotiz);

            console.log("Cotizaciones del cliente",documentosFindCotiz)


            //Llamar a productos adquiridos 
            const conectarBaseAdquir = query(collection(firestore,"EquipoOutbound"), where("CodigoCli","==",busquedaCli ))

            const conectarSnapshotAdquir = await getDocs(conectarBaseAdquir)


            const documentosFindAdquir = conectarSnapshotAdquir.docs.map((doc) => {

                return doc.data()

            })
            setEquiposAdquiridos(documentosFindAdquir);

            console.log("Equipos contratados del cliente",documentosFindAdquir)
            
           
          toast.success("Datos obtenidos exitosamente.")
          
        } catch (error) {
            console.log(error)
        }

      
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: 'grey', // Fondo verde
        color: 'white', // Texto blanco
        fontWeight: 'bold', // Texto en negrita
      },
    },
   
  };

  return (
    <NavTab user={user}>
      <Container className='Contenedor-Clientes'>
        <Grid>
          {/* Sección de búsqueda de clientes */}
          <Grid.Column width={8} mobile={16} tablet={8} computer={7}>
            <Segment>
              <Header as='h1'>Busqueda de Clientes</Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={12}>
                    <Input
                      placeholder="Código del cliente"
                      value={busquedaCli}
                      onChange={(e) => setBusquedaCli(e.target.value)}
                      size="large"
                      action={{
                        color: 'yellow',
                        icon: 'search',
                        onClick: dataCall,
                        content: 'Buscar',
                        size: "large"
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              {/* Lista de clientes encontrados */}

              {datosCli.length > 0 && (
                <Segment size='large'>
                  {datosCli.map((cliente) => (
                    <div key={cliente.documento}>
                      <Header as='h1'>
                        <Icon name='user circle' color='green' />
                        <Header.Content>
                          {cliente.nombres} {cliente.apellidos}
                          <Header.Subheader> Documento: {cliente.documento}</Header.Subheader>
                        </Header.Content>
                      </Header>
                      <List className='lista-cliente'>
                        <List.Item>
                          <Icon name='at' color='black' style={{ marginRight: '10px' }} />
                          Correo: {cliente.correoElectronico}
                        </List.Item>
                        <List.Item>
                          <Icon name='file icon' color='black' style={{ marginRight: '10px' }} />
                          Tipo de Documento: {cliente.tipoDoc}
                        </List.Item>
                        <List.Item>
                          <Icon name='birthday cake' color='yellow' style={{ marginRight: '10px' }} />
                          Fecha Nacimiento: {cliente.fechaNacimiento}
                        </List.Item>
                        <List.Item>
                          <Icon name='home' style={{ marginRight: '10px' }} />
                          Dirección: {cliente.direccion}
                        </List.Item>
                      </List>
                    </div>
                  ))}
                </Segment>
              )}
            </Segment>
          </Grid.Column>

          {/* Sección de cotizaciones */}
          {datosCli && (
            <Grid.Column width={8} mobile={16} tablet={8} computer={8}>
              <Segment>
                <Header as='h3'>Cotizaciones del CLiente</Header>
                <Card fluid>
                  <Card.Content>
                    <Card.Header></Card.Header>
                    <Card.Description>
                      <DataTable
                        columns={[
                          { name: 'Numero Cotizacion', selector: row => row.NumeroCotizacion, sortable: true },
                          { name: 'Fecha Emisión', selector: row => row.FechaEmision || 'N/A', sortable: true },
                          { name: 'Fecha Vencimiento', selector: row => row.FechaVencimiento || 'N/A', sortable: true },
                          { name: 'Monto Total', selector: row => row.MontoTotal || 'N/A', sortable: true },
                          {
                            name: 'Ver', 
                            cell: row => (
                              <Button
                                icon
                                color="yellow"
                                size='small'
                                onClick={() => {
                                  setCotizacionSeleccionada(row); 
                                  setModalOpen(true); 
                                }}
                              >
                                <Icon name='eye' />
                              </Button>
                            ),      width: '100px' 

                          }
                        ]}
                        data={cotizacionesCli}
                        pagination
                        customStyles={customStyles}
                        paginationPerPage={5}
                        dense
                      />
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Segment>

              {/* //Productos en Vigencia */}
              <Segment>
                <Header as='h3'>Equipos Contratados</Header>
                <Card fluid>
                  <Card.Content>
                    <Card.Header></Card.Header>
                    <Card.Description>
                        <DataTable
                            columns={[
                              { name: 'CodigoEquipo', selector: row => row.CodigoEquipo, sortable: true },
                              { name: 'Fecha Adquisición', selector: row => row.FechaSalida || 'N/A', sortable: true },
                              { name: 'Fecha Devolución', selector: row => row.FechaDevolucion || 'N/A', sortable: true },
                            ]}
                            data={equiposAdquiridos}
                            pagination
                            customStyles={customStyles}
                            paginationPerPage={5}
                            dense
                          />
                        
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Segment>
            </Grid.Column>

          )}

          
        </Grid>

        {/* Modal de detalles de cotización */}

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            size='tiny'
            dimmer='blurring'
          >
            <Modal.Header>
              <Header as='h2' style={{ textAlign: 'center', backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd', margin: 0 }}>
                Detalles Cotización
                <Button
                  icon='close'
                  onClick={() => setModalOpen(false)}
                  style={{ color: 'red', position: 'absolute', right: '10px', top: '10px', background: 'none' }}
                />
              </Header>
            </Modal.Header>

            <Modal.Content scrolling>
              <Segment raised padded='very'>
                <Grid divided>

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='user' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Cliente</Header>
                      <p style={{ fontSize: '1.2em' }}>
                        {cotizacionSeleccionada?.Cliente.nombres}
                      </p>
                      </Grid.Column>
                  </Grid.Row>

                  <Divider />

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='calendar alternate outline' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Fecha de Creación</Header>
                      <p style={{ fontSize: '1.2em' }}>
                      {cotizacionSeleccionada?.FechaEmision}
                      </p>
                    </Grid.Column>

                    
                  </Grid.Row>

                  <Divider />

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='calendar alternate outline' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Fecha de Vencimiento</Header>
                      <p style={{ fontSize: '1.2em' }}>
                      {cotizacionSeleccionada?.FechaVencimiento}
                      </p>
                    </Grid.Column>

                    
                  </Grid.Row>

                  <Divider />

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='cart arrow down' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Precio Total</Header>
                      <p style={{ fontSize: '1.2em' }}>
                      S/.{cotizacionSeleccionada?.MontoTotal}
                      </p>
                    </Grid.Column>
                  </Grid.Row>

                  <Divider />

                  {/* Mostrar los equipos asociados a la cotización */}
                  <Grid.Row>
                    <Grid.Column>
                      <Header as='h3'>Equipos Cotizados: </Header>
                      {cotizacionSeleccionada?.Equipos?.length > 0 ? (
                        <>
                          {cotizacionSeleccionada.Equipos.map((equipo, index) => (
                            <Segment key={index}>
                              <p><strong>Cod. Equipo:</strong> {equipo.codigoEquipo}</p>
                              <p><strong>Descripción:</strong> {equipo.descripcion}</p>
                              <p><strong>Cantidad:</strong> {equipo.cantidad}</p>
                              <p><strong>Precio Unitario:</strong> S/.{equipo.precioUnitario}</p>
                              <p><strong>Total:</strong> S/.{equipo.total}</p>
                            </Segment>
                          ))}
                        </>
                      ) : (
                        <p>No hay equipos en esta cotización.</p>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Modal.Content>
          </Modal>
      </Container>
    </NavTab>
  );
};



export default Clientes;
