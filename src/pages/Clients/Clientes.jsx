import React, { useState } from 'react';
import { getDocs, collection, getFirestore, query, where } from 'firebase/firestore';
import firebaseApp from "../../firebase/credenciales";
import NavTab from '../../components/NavTab';
import "./../../App.css";
import "./Clientes.css";
import { Container, Grid, Segment, Header, Icon, Input, Card, List, Button, Modal, Divider } from 'semantic-ui-react';
 
const firestore = getFirestore(firebaseApp);

const Clientes = ({ user }) => {

<<<<<<< HEAD
const Clientes = ({user}) => {
    
    const [datosCli, setDatosCli] = useState([]);
    const [cotizacionesCli, setCotizacionesCli] = useState([])
    const [equiposAdquiridos, setEquiposAdquiridos] = useState([])

    const [busquedaCli, setBusquedaCli] = useState([]);
=======
  const [contenido, setContenido] = useState([]);
  const [busquedaCli, setBusquedaCli] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
>>>>>>> origin/alvaro-dev

  const dataCall = async () => {
    try {
      const conectarBase = query(collection(firestore, "DataComercialOficial"), where("CodigoCli", "==", busquedaCli));
      const conectarSnapshot = await getDocs(conectarBase);
      const documentosFind = conectarSnapshot.docs.map((doc) => doc.data());

<<<<<<< HEAD
        try {

            //LLamar datos del cliente
            const conectarBase = query(collection(firestore,"DataComercialOficial"), where("CodigoCli","==",busquedaCli ))

            const conectarSnapshot = await getDocs(conectarBase)


            const documentosFind = conectarSnapshot.docs.map((doc) => {

                return doc.data()

            })
            setDatosCli(documentosFind);

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
            
        } catch (error) {
            console.log(error)
        }
=======
      setContenido(documentosFind);
>>>>>>> origin/alvaro-dev

      if (documentosFind.length === 1) {
        setClienteSeleccionado(documentosFind[0]);
      } else {
        setClienteSeleccionado(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavTab user={user}>
      <Container className='Contenedor-Clientes'>
        <Grid>
          {/* Sección de búsqueda de clientes */}
          <Grid.Column width={8} mobile={16} tablet={8} computer={7}>
            <Segment>
              <Header as='h1'>Gestión de Clientes</Header>
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

<<<<<<< HEAD
        <Card style={{margin:"20px", width:"auto", padding:"20px", fontFamily:"Poppins"}}>
            <Header as="h1">Clientes</Header>

                <div>
                    <Input
                    className="margen-derecho"
                    onChange={(e) => setBusquedaCli(e.target.value)}
                    />
                    <Button color="yellow" onClick={dataCall}>
                    Buscar
                    </Button>
                </div>
               
            {datosCli.length > 0 ? (
                <Container className="contenedor-busqueda">
                <Container className="inline-item margen-derecho">
                    {
                    datosCli.map((cliente) => {
                        return (
=======
              {contenido.length > 0 && (
                <Segment size='large'>
                  {contenido.map((cliente) => (
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
          {clienteSeleccionado && (
            <Grid.Column width={6} mobile={16} tablet={8} computer={6}>
              <Segment>
                <Header as='h3'>Cotizaciones del CLiente</Header>
                <Card fluid>
                  <Card.Content>
                    <Card.Header></Card.Header>
                    <Card.Description>
                      <List>
                        <List.Item className='lista-cliente'>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <Icon name='calendar alternate outline' style={{ marginRight: '10px' }} />
                              Aca irian la cotizaciones
                            </div>
                            <Button
                              icon
                              color="yellow"
                              size='large'
                              onClick={() => setModalOpen(true)}
                            >
                              <Icon name='plus' />
                            </Button>
                          </div>
                        </List.Item>
                      </List>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Segment>
            </Grid.Column>
          )}
        </Grid>

        {/* Modal de detalles de cotización */}

        {clienteSeleccionado && (
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
>>>>>>> origin/alvaro-dev

            <Modal.Content scrolling>
              <Segment raised padded='very'>
                <Grid divided>

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='user' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Cliente</Header>
                      <p style={{ fontSize: '1.2em' }}>{clienteSeleccionado.nombres} {clienteSeleccionado.apellidos}</p>
                    </Grid.Column>
                  </Grid.Row>

                  <Divider />

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='calendar alternate outline' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Fecha de la Cotizacion</Header>
                      <p style={{ fontSize: '1.2em' }}>17/10/2024</p>
                    </Grid.Column>
                  </Grid.Row>

<<<<<<< HEAD
                                <p>
                                    <b>Correo Electronico:</b>  {cliente.correoElectronico}
                                </p>

                                <p>
                                    <b>Fecha Nacimiento:</b>  {cliente.fechaNacimiento}
                                </p>
                            </>
                       
                        );
                    })
                    }
                </Container>
                <Container className="inline-item">
                   
                    <Card>
                        Cotizacion N° 1 15/07/2022
                    </Card>

                    <Card>
                        Cotizacion N° 2 20/12/2023
                    </Card>

                    <Card>
                        Cotizacion N° 3 22/01/2024
                    </Card>

                    <Card>
                        Cotizacion N° 4 17/07/2024
                    </Card>
                </Container>
                </Container>
            ) : null}
        </Card>
        
=======
                  <Divider />
>>>>>>> origin/alvaro-dev

                  <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                      <Icon name='cart arrow down' size='big' />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as='h3'>Precio Total</Header>
                      <p style={{ fontSize: '1.2em' }}>s/150.00</p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Modal.Content>
          </Modal>
        )}
      </Container>
    </NavTab>
  );
};

//Modal a Integrar de Productos
<Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  size='tiny'
  dimmer='blurring'
>
  <Modal.Header>
    <Header as='h2' style={{ textAlign: 'center', backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd', margin: 0 }}>
      Detalles Productos
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
            <Icon name='archive' size='big' />
          </Grid.Column>
          <Grid.Column width={12}>
            <Header as='h3'>Nombre</Header>
            <p style={{ fontSize: '1.2em' }}> Frigider CEO 400 </p>
          </Grid.Column>
        </Grid.Row>

        <Divider />

        <Grid.Row columns={2}>
          <Grid.Column width={4}>
            <Icon name='cart arrow down' size='big' />
          </Grid.Column>
          <Grid.Column width={12}>
            <Header as='h3'>Caracteristicas</Header>
            <p style={{ fontSize: '1.2em' }}>Frigider numero uno en el mercado el mejor de todos</p>
          </Grid.Column>
        </Grid.Row>

        <Divider />

        <Grid.Row columns={2}>
          <Grid.Column width={4}>
            <Icon name='dollar sign' size='big' />
          </Grid.Column>
          <Grid.Column width={12}>
            <Header as='h3'>Precio</Header>
            <p style={{ fontSize: '1.2em' }}>s/15000</p>
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </Segment>
  </Modal.Content>
</Modal>

export default Clientes;

