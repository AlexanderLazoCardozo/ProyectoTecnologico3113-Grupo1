import React, { useEffect, useState } from 'react'
import NavTab from '../../components/NavTab'
import firebaseApp from '../../firebase/credenciales';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Button, Card, Container, Form, Header, Input, Modal, ModalActions, ModalContent, ModalHeader, Table } from "semantic-ui-react";
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import CotizacionesTabla from "./Tabla"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const firestore = getFirestore(firebaseApp)

const Cotizaciones = ({user}) => {

    //Obtencion de documentos
    const [open, setOpen] = React.useState(false)
    const [dataCotizaciones, setDataCotizaciones] = useState([])

    const getDataCotizaciones = async() => {

        try {

            toast.info("Conectando base...")

            const conectarData = query(collection(firestore, "DataCotizaciones"))
            
            const snapData = await getDocs(conectarData)

            const docsMap = snapData.docs.map((doc) => {

                return doc.data()

            })

            setDataCotizaciones(docsMap)

            console.log("Cotizaciones: ", docsMap)

            toast.success("Datos obtenidos exitosamente.")

        } catch (error) {
            console.log(error)
        }

    }


    //Cliente Dinamico
    const [searchClienteRUC, setSearchClienteRUC] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

   
    const handleSearch = async (term) => {

        setSearchClienteRUC(term.toUpperCase());
      
        const querySnapshot = await getDocs(
          query(collection(firestore, 'DataComercialOficial'), where('documento', '==', term))
        );
      
        const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

    //Inventario Dinamico
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
            const conectarEquipos = query(collection(firestore, "EquipoInventory"));
            const snapEquipos = await getDocs(conectarEquipos);

            const equiposList = snapEquipos.docs.map(doc => ({
                id: doc.id,
                codigoEquipo: doc.data().CodigoEquipo,
                stock: doc.data().Stock,
                direccion:doc.data().Direccion
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

        const equipo = equipos.find(equipo => equipo.codigoEquipo === selectedCodigo);
        if (equipo) {
            setSelectedEquipo(selectedCodigo);
            setStock(equipo.stock);
        }
    };


    const [equiposSalida, setEquiposSalida] = useState([])


    const handleConfirmSalida = async () => {

        try {


            if(searchResults.length == 0){

                 //Generar un CodigoCli respectivo si el cliente no existe
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

                //Actualizar equipo (...map de equipos) restandole el stock segun cantidad llevada
                //y añadiendole una Interaccion



                //Agregar documento cotizacion con el CodigoCli respectivo


            } else {

                let ClienteUID = searchResults.UID

                console.log("si existe")

            }
            
        } catch (error) {
            console.log(error)
        }

    }
     
  return (
    <NavTab  user={user}>
        {/* <Card style={{margin:"20px", width:"auto", padding:"20px", fontFamily:"Poppins"}}>
            <div>
                <Header as="h1">Cotizaciones</Header>
                <Button onClick={getDataCotizaciones} primary>Conectar Cotizaciones</Button>
                <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button onClick={getDataCotizaciones} positive> Agregar </Button>}
                >
                    <ModalHeader>Ingresar Datos</ModalHeader>

                    <ModalContent >

                        <Form>
                            <Form.Input 
                            label="RUC"
                            placeholder="Ingresar documento del cliente"
                            value={searchClienteRUC}
                            onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Form>

                        <br />

                        {searchResults.map((client) => (
                            <div key={client.CodigoCli} onClick={() => handleSelectClient(client)}>
                            <Table celled>
                                <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Cliente Existente - Se le generara una nueva cotización</Table.HeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{client.nombres} {client.apellidos}</Table.Cell>
                                </Table.Row>
                                </Table.Body>
                            </Table>
                            <Form>
                                <Form.Group widths="equal">
                                <Form.Input
                                    label='Código'
                                    placeholder='CódigoCli'
                                    value={client.CodigoCli}
                                    id="code"
                                    readOnly
                                />
                                <Form.Input
                                    label='Id de cliente'
                                    placeholder="Id de cliente"
                                    value={client.UID}
                                    id="Documento"
                                    readOnly
                                />
                                </Form.Group>
                            </Form>
                            </div>
                        ))}

                        <br />

                        Agregar Equipo Solicitado:
                        <br />

                            <>
                                <label htmlFor="equipoSelect">Seleccionar Equipo:</label>
                                <select id="equipoSelect" value={selectedEquipo} onChange={handleSelectChange}>
                                    <option value="">Seleccione un equipo</option>
                                    {equipos.map(equipo => (
                                    <option key={equipo.id} value={equipo.codigoEquipo}>
                                        {equipo.codigoEquipo}
                                    </option>
                                    ))}
                                </select>

                                <label htmlFor="stockInput">Stock:</label>
                                <input id="stockInput" type="text" value={stock} disabled />
                            </>
                    
                    
                    
                    </ModalContent>
                    
                    <ModalActions>
                        <Button color='black' onClick={() => setOpen(false)}>
                        Cerrar
                        </Button>
                        <Button
                        content="Crear"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => setOpen(false)}
                        positive
                        />
                    </ModalActions>
                </Modal>
                
            </div>


        </Card> */}
        <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
          <Header as="h1">Cotizaciones</Header>
          
          <div>
            {/* <Input
              placeholder="Buscar cotización..."
              // onChange={(e) => setBusquedaCotizacion(e.target.value)}
              className="margen-derecho"
            /> */}
            <Button color="yellow" 
            onClick={getDataCotizaciones}
            >
              Conectar Cotizaciones
            </Button>

            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                  <Button
                    color="black"
                    // onClick={handleNuevo}
                    style={{ marginLeft: "10px" }}
                  >
                    Nueva Cotización
                  </Button>
                }
            >
                <ModalHeader>Ingresar Datos</ModalHeader>

                <ModalContent >

                    <Form>
                        <Form.Input 
                        label="RUC"
                        placeholder="Ingresar documento del cliente"
                        value={searchClienteRUC}
                        onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Form>

                    <br />

                    {searchResults.map((client) => (
                        <div key={client.CodigoCli} onClick={() => handleSelectClient(client)}>
                        <Table celled>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Cliente Existente - Se le generara una nueva cotización</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            <Table.Row>
                                <Table.Cell>{client.nombres} {client.apellidos}</Table.Cell>
                            </Table.Row>
                            </Table.Body>
                        </Table>
                        <Form>
                            <Form.Group widths="equal">
                            <Form.Input
                                label='Código'
                                placeholder='CódigoCli'
                                value={client.CodigoCli}
                                id="code"
                                readOnly
                            />
                            <Form.Input
                                label='Id de cliente'
                                placeholder="Id de cliente"
                                value={client.UID}
                                id="Documento"
                                readOnly
                            />
                            </Form.Group>
                        </Form>
                        </div>
                    ))}

                    <br />

                    Agregar Equipo Solicitado:
                    <br />

                        <>
                            <label htmlFor="equipoSelect">Seleccionar Equipo:</label>
                            <select id="equipoSelect" value={selectedEquipo} onChange={handleSelectChange}>
                                <option value="">Seleccione un equipo</option>
                                {equipos.map(equipo => (
                                <option key={equipo.id} value={equipo.codigoEquipo}>
                                    {equipo.codigoEquipo}
                                </option>
                                ))}
                            </select>

                            <label htmlFor="stockInput">Stock:</label>
                            <input id="stockInput" type="text" value={stock} disabled />
                        </>
                
                
                
                </ModalContent>
                
                <ModalActions>
                    <Button color='black' onClick={() => setOpen(false)}>
                    Cerrar
                    </Button>
                    <Button
                    content="Crear"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => setOpen(false)}
                    positive
                    />
                </ModalActions>
            </Modal>
            
          </div>
          <br />
          <Container>
            <CotizacionesTabla data={dataCotizaciones} />
          </Container>
      </Card>
    </NavTab>
  )
}

export default Cotizaciones