import React, { useState } from 'react'
import {getDocs, addDoc, collection, writeBatch ,getFirestore, query,setDoc, doc, updateDoc, arrayUnion, getDoc, where} from 'firebase/firestore';
import firebaseApp from "../../firebase/credenciales"
import NavTab from '../../components/NavTab';
import "./../../App.css";
import "./Clientes.css";
import { Button, Card, Container, Header, Input } from "semantic-ui-react";

const firestore = getFirestore(firebaseApp)

const Clientes = ({user}) => {
    
    const [datosCli, setDatosCli] = useState([]);
    const [cotizacionesCli, setCotizacionesCli] = useState([])
    const [equiposAdquiridos, setEquiposAdquiridos] = useState([])

    const [busquedaCli, setBusquedaCli] = useState([]);

    const dataCall = async () =>{

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

    }


  return (
    <NavTab  user={user}>


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

                            <>
                                <p>
                                    <b>Nombres y Apellidos:</b>  {cliente.nombres} {cliente.apellidos}
                                </p>

                                <p>
                                    <b>Documento:</b>  {cliente.documento}
                                </p>

                                <p>
                                    <b>Tipo Documento:</b>  {cliente.tipoDoc}
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
        

    </NavTab>
  )
}

export default Clientes