import React, { useState } from 'react'
import {getDocs, addDoc, collection, writeBatch ,getFirestore, query,setDoc, doc, updateDoc, arrayUnion, getDoc, where} from 'firebase/firestore';
import firebaseApp from "../../firebase/credenciales"
import NavTab from '../../components/NavTab';
import "./../../App.css";
import "./Clientes.css";
import { Button, Card, Container, Header, Input } from "semantic-ui-react";

const firestore = getFirestore(firebaseApp)

const Clientes = ({user}) => {
    
    const [contenido, setContenido] = useState([]);
    const [busquedaCli, setBusquedaCli] = useState([]);

    const dataCall = async () =>{

        try {

            const conectarBase = query(collection(firestore,"DataComercialOficial"), where("CodigoCli","==",busquedaCli ))

            const conectarSnapshot = await getDocs(conectarBase)


            const documentosFind = conectarSnapshot.docs.map((doc) => {

                return doc.data()

            })
            setContenido(documentosFind);

            console.log("documentosFind",documentosFind)

            
        } catch (error) {
            console.log(error)
        }

    }


  return (
    <NavTab  user={user}>


        <Card style={{margin:"20px", width:"auto", padding:"20px", fontFamily:"Poppins"}}>
            <Container textAlign="left">
            <Header as="h1">Clientes</Header>
            <Container>
                <Input
                className="margen-derecho"
                onChange={(e) => setBusquedaCli(e.target.value)}
                />
                <Button color="yellow" onClick={dataCall}>
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

                            <>
                                <p>
                                    <b>Nombres y Apellidos:</b>  {cliente.nombres} {cliente.apellidos}
                                </p>

                                <p>
                                    <b>Documento:</b>  {cliente.dni}
                                </p>

                                <p>
                                    <b>Tipo Documento:</b>  {cliente.documento}
                                </p>

                                <p>
                                    <b>Direccion:</b>  {cliente.direccion}
                                </p>

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
            </Container>
        </Card>
        

    </NavTab>
  )
}

export default Clientes