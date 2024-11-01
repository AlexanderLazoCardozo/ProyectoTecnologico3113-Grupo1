import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
// import { Toast } from 'primereact/toast';
import logo from './../../assets/LogoFogel.png';
import './../../App.css';
import {
    ModalHeader,
    ModalDescription,
    ModalContent,
    ModalActions,
    Header,
    Image,
    Modal,  
    Button,
    Icon,
    Table,
    Form,
    Popup
  } from 'semantic-ui-react'
import { collection, getDocs, doc,setDoc,getFirestore, query, where, orderBy, limit, getDoc, writeBatch } from 'firebase/firestore';
import firebaseApp from '../../firebase/credenciales';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const firestore = getFirestore(firebaseApp)

const NuevaCotizacion = () => {

    const [openNew, setOpenNew] = React.useState(false)


    const [nombres, setNombres] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [rucCliente, setRucCliente] = useState('');
    const [direccionCliente, setDireccionCliente] = useState('');
    const [numTelefono, setNumTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correoElectronico, setCorreoelectronico] = useState('');
    const [condicion, setCondicion] = useState(null);
    const [filas, setFilas] = useState([{ codigo: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 }]);
    // const toast = useRef(null);


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


    const condiciones = [
        { name: 'Contado', code: 'contado' },
        { name: 'Crédito', code: 'credito' }
    ];

    // const manejarEnvio = async (e) => {
    //     e.preventDefault();

    //     const RUC_REGEX = /^\d{11}$/;
    //     if (!RUC_REGEX.test(rucCliente)) {
    //         toast.current.show({ severity: 'error', summary: 'Error', detail: 'RUC debe contener 11 caracteres' });
    //         return;
    //     }


    //     const data = {
    //         nombres,
    //         apellidoPaterno,
    //         apellidoMaterno,
    //         rucCliente,
    //         direccionCliente,
    //         filas,
    //         condicion,
    //     };

    //     try {
    //         const response = await fetch('____', {  // URL Colrcanle
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(data),
    //         });

    //         const result = await response.json();

    //         if (response.ok) {
    //             toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Datos enviados correctamente' });                
    //             setNombres('');
    //             setApellidoPaterno('');
    //             setApellidoMaterno('');
    //             setRucCliente('');
    //             setDireccionCliente('');
    //             setCondicion(null);
    //             setFilas([{ codigo: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 }]);
    //         } else {
    //             toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error al enviar datos' });
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar datos' });
    //     }
    // };



    const agregarFila = () => {
        setFilas([...filas, { codigo: '', cantidad: 0, unidad: '', precio: 0 }]);
    };

    const manejarCambioFila = (index, campo, valor) => {

        console.log(campo)
        console.log(valor)
        if(campo == "cantidad" && valor > filas[index].stock){
            toast.error("La cantidad es mayor al stock disponible");
        }
        
        const nuevasFilas = [...filas];
        
        nuevasFilas[index][campo] = valor;
    
        if (campo === 'codigo') {
            const equipoSeleccionado = equipos.find(equipo => equipo.codigoEquipo === valor);
            if (equipoSeleccionado) {
                nuevasFilas[index].stock = equipoSeleccionado.stock; 
                nuevasFilas[index].descripcion = equipoSeleccionado.descripcion; 
                nuevasFilas[index].precio = equipoSeleccionado.precio; 
            }
        }
    
        setFilas(nuevasFilas); 
    };


    const calcularMontoTotal = () => {
        return filas.reduce((total, fila) => {
            const cantidad = parseInt(fila.cantidad) || 0; 
            const precio = parseFloat(fila.precio) || 0;
            const totalPorEquipo = cantidad * precio;
    
            return total + totalPorEquipo; 
        }, 0); 
    };

    const incrementarCodigoCli = (codigoCli) => {
        // Extraer la parte numérica del CodigoCli
        const numero = parseInt(codigoCli.replace("CLI", ""), 10);
        
        // Incrementar el número
        const nuevoNumero = numero + 1;
        
        // Formatear el nuevo codigoCli asegurándose de que tenga 4 dígitos
        const nuevoCodigoCli = `CLI${String(nuevoNumero).padStart(4, '0')}`;
        
        return nuevoCodigoCli;
    };

    const reiniciarFormulario = () => {
        setNombres('');
        setApellidoPaterno('');
        setApellidoMaterno('');
        setDireccionCliente('');
        setCorreoelectronico('');
        setSearchClienteRUC('');
        setFechaNacimiento('');
        setNumTelefono('');
        setFilas([]);
    };

    //Crear cotizacion
    const crearCotizacion = async(event) => {
        event.preventDefault()
        try {

            const formatearFecha = (fecha) => {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (0-11 así que sumamos 1)
                const anio = fecha.getFullYear();
                return `${dia}/${mes}/${anio}`;
            };
            
            const fechaEmision = formatearFecha(new Date());
                
            const vencimientoDate = new Date();
            vencimientoDate.setDate(vencimientoDate.getDate() + 10);
            const fechaVencimiento = formatearFecha(vencimientoDate);

            const qCotizaciones = query(
                collection(firestore, "DataCotizaciones"),
                orderBy("NumeroCotizacion", "desc"),
                limit(1)
            );
            
            const snapshotCotizaciones = await getDocs(qCotizaciones);
            let nuevoNumeroCotizacion = "VSFP-2024-00001"; 
            
            if (!snapshotCotizaciones.empty) {
                const lastCotizacion = snapshotCotizaciones.docs[0];
                const lastNumeroCotizacion = lastCotizacion.data().NumeroCotizacion;
                const lastNumber = parseInt(lastNumeroCotizacion.slice(-5)) + 1;
                nuevoNumeroCotizacion = `VSFP-2024-${String(lastNumber).padStart(5, '0')}`;
            }

            //Generar un CodigoCli respectivo si el cliente ES NUEVO
            if(searchResults.length == 0){

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

                // const batch = writeBatch(firestore);

                const datosCliente = {
                    nombres: nombres + " " + apellidoPaterno + " " + apellidoMaterno,
                    direccion: direccionCliente,
                    ruc:searchClienteRUC,
        
                }
        
                const montoTotal = calcularMontoTotal(); 

               
                
               
                
                const cotizacion = {
                    Cliente: datosCliente,
                    CodigoCli: newCodigoCli, 
                    Equipos: filas.map(fila => ({
                        cantidad: fila.cantidad,
                        codigoEquipo: fila.codigo,
                        descripcion: fila.descripcion,
                        precioUnitario: fila.precio,
                        total: parseFloat((fila.cantidad * fila.precio).toFixed(2)),
                        unidad: "UND",
                    })),
                    MontoTotal: (montoTotal).toFixed(2),
                    FechaEmision: fechaEmision,
                    FechaVencimiento: fechaVencimiento,
                    NumeroCotizacion: nuevoNumeroCotizacion,
                    Status:"En espera"
                };
                console.log("cotizacion",cotizacion)

                try {
                    await setDoc(doc(collection(firestore, "DataCotizaciones")), cotizacion);
                    
                    const clienteUID = doc(collection(firestore, "DataComercialOficial")).id; // Genera un nuevo ID único para el cliente

                    const clienteDoc = {
                        CodigoCli: newCodigoCli,
                        nombres: nombres,
                        apellidos: apellidoPaterno + " " + apellidoMaterno,
                        correoElectronico:  correoElectronico,
                        direccion:direccionCliente,
                        documento:  searchClienteRUC,
                        fechaNacimiento: fechaNacimiento,
                        numTelefono: numTelefono,
                        //Tipo Doc descartado?
                        UID: clienteUID, 
                    };
            
                    // Guardar el documento del cliente en Firestore
                    await setDoc(doc(collection(firestore, "DataComercialOficial"), clienteUID), clienteDoc);
                    

                    const batch = writeBatch(firestore);

                    // Actualizar el stock de cada equipo en la colección EquipoInventory
                    for (const equipo of cotizacion.Equipos) {

                        const equipoQuery = query(
                            collection(firestore, "EquipoInventory"),
                            where("CodigoEquipo", "==", equipo.codigoEquipo)
                        );
            
                        const equipoSnapshot = await getDocs(equipoQuery);

                        if (!equipoSnapshot.empty) {
                            const equipoDoc = equipoSnapshot.docs[0];
                            const currentStock = parseInt(equipoDoc.data().Stock) || 0;
                            const newStock = currentStock - equipo.cantidad;

                            console.log("current", currentStock, "new", equipo.cantidad)
            
                            batch.update(equipoDoc.ref, { Stock: newStock });
                        } else {
                            console.warn(`Equipo con código ${equipo.codigoEquipo} no encontrado en EquipoInventory.`);
                        }
                    }

                    await batch.commit();

                    setOpenNew(false)
                    toast.success("Cotizacion creada.")
                    reiniciarFormulario();  

                    // toast.current.show({ severity: 'success', summary: 'Cotización creada', detail: 'La cotización se ha guardado con éxito' });
                    console.log("Procesado Si existe")
                } catch (error) {
                    console.error("Error al guardar en Firestore: ", error);
                    // toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la cotización' });
                }

                //Actualizar equipo (...map de equipos) restandole el stock segun cantidad llevada
                //y añadiendole una Interaccion



            } else {

                // let ClienteUID = searchResults.UID

                console.log("si existe")

                const datosCliente = {
                    nombres: searchResults[0].nombres + " " + searchResults[0].apellidos,
                    direccion: searchResults[0].direccion,
                    ruc: searchResults[0].documento,
        
                }
        
                const montoTotal = calcularMontoTotal(); 
        
                const cotizacion = {
                    Cliente: datosCliente,
                    CodigoCli: searchResults[0].CodigoCli, 
                    Equipos: filas.map(fila => ({
                        cantidad: fila.cantidad,
                        codigoEquipo: fila.codigo,
                        descripcion: fila.descripcion,
                        precioUnitario: fila.precio,
                        total: parseFloat((fila.cantidad * fila.precio).toFixed(2)),
                        unidad: "UND",
                    })),
                    MontoTotal: (montoTotal).toFixed(2),
                    FechaEmision: fechaEmision,
                    FechaVencimiento: fechaVencimiento,
                    NumeroCotizacion: nuevoNumeroCotizacion,
                    Status:"En espera"
                };

                console.log("cotizacion",cotizacion)

                try {
                    await setDoc(doc(collection(firestore, "DataCotizaciones")), cotizacion);

                    const batch = writeBatch(firestore);

                    // Actualizar el stock de cada equipo en la colección EquipoInventory
                    for (const equipo of cotizacion.Equipos) {

                        const equipoQuery = query(
                            collection(firestore, "EquipoInventory"),
                            where("CodigoEquipo", "==", equipo.codigoEquipo)
                        );
            
                        const equipoSnapshot = await getDocs(equipoQuery);

                        if (!equipoSnapshot.empty) {
                            const equipoDoc = equipoSnapshot.docs[0];
                            const currentStock = parseInt(equipoDoc.data().Stock) || 0;
                            const newStock = currentStock - equipo.cantidad;

                            console.log("current", currentStock, "new", equipo.cantidad)
            
                            batch.update(equipoDoc.ref, { Stock: newStock });
                        } else {
                            console.warn(`Equipo con código ${equipo.codigoEquipo} no encontrado en EquipoInventory.`);
                        }
                    }

                    await batch.commit();

                    // toast.current.show({ severity: 'success', summary: 'Cotización creada', detail: 'La cotización se ha guardado con éxito' });
                    console.log("Procesado No existe")
                    reiniciarFormulario();  // Reiniciar los datos después de procesar

                    toast.success("Cotizacion y clientes creados.")
                    setOpenNew(false)

                    fetchEquipos();
                } catch (error) {
                    console.error("Error al guardar en Firestore: ", error);
                    // toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la cotización' });
                }

            }
            
        } catch (error) {
            console.log(error)
        }

        

    }


    //Inventario Dinamico
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState('');


    const fetchEquipos = async () => {
        try {
        const conectarEquipos = query(collection(firestore, "EquipoInventory"));
        const snapEquipos = await getDocs(conectarEquipos);

        const equiposList = snapEquipos.docs.map(doc => ({
            id: doc.id,
            codigoEquipo: doc.data().CodigoEquipo,
            stock: doc.data().Stock,
            precio: doc.data().Precio,
            descripcion: doc.data().Descripcion,
        }));

        setEquipos(equiposList);
        } catch (error) {
        console.error("Error fetching equipos:", error);
        }
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

  

    return (

        <Modal
        style={{margin:"auto", width:"auto"}}
      onClose={() => setOpenNew(false)}
      onOpen={() => setOpenNew(true)}
      open={openNew}
      trigger={<Button primary>Nueva Cotización</Button>}
    >
      <ModalHeader>Crear nueva cotización</ModalHeader>
      <div className="card">
            <img src={logo} alt="Logo" className="logoJav" />
            {/* <Toast ref={toast} /> */}
            <h1>Cotización</h1>
            <form 
            // onSubmit={manejarEnvio}
            >
                {/* Datos del Cliente */}

                <h3>Datos del Cliente</h3>
                <div className="p-grid">
                    <div className="p-col">
                        <div className="field">
                            <label htmlFor="rucCliente">Documento</label>
                            <InputText
                                id="rucCliente"
                                value={searchClienteRUC}
                                onChange={(e) => handleSearch(e.target.value)}

                                maxLength={11}
                                required
                            />
                        </div>


                    {searchResults.map((client) => (
                        <div style={{border:"2px solid black", padding:"10px", borderRadius:"10px"}} key={client.CodigoCli} onClick={() => handleSelectClient(client)}>
                        <Table  celled>
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
                                label='Direccion'
                                placeholder="Direccion"
                                value={client.direccion}
                                id="Documento"
                                readOnly
                            />
                            </Form.Group>
                        </Form>
                        </div>
                    ))}

                    </div>

                    {/* Si el cliente no existe tomar estos datos */}
                    {searchResults.length === 0 && 
                    
                    <>
                        <div className="field">
                            <label htmlFor="nombres">Nombres</label>
                            <InputText id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                            <InputText id="apellidoPaterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="apellidoMaterno">Apellido Materno</label>
                            <InputText id="apellidoMaterno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="direccionCliente">Dirección</label>
                            <InputText id="direccionCliente" value={direccionCliente} onChange={(e) => setDireccionCliente(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="correoCliente">Correo Electronico</label>
                            <InputText id="correoCliente" value={correoElectronico} onChange={(e) => setCorreoelectronico(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="numTelefono">Telefono </label>
                            <InputText id="numTelefono" value={numTelefono} onChange={(e) => setNumTelefono(e.target.value)} required />
                        </div>

                        <div className="field">
                            <label htmlFor="fechaNacimiento">Fecha Nacimiento</label>
                            <input type='date' id="fechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                        </div>
                    </>}

                    
                       
                    
                </div>
               

                <h3>Datos del Equipo</h3>
                <table className="p-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Stock Actual</th>

                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((fila, index) => (
                            <tr key={index}>
                                <td>
                                     {/* Reemplaza InputText con el select dinámico */}
                                    <select 
                                        id={`equipoSelect-${index}`} 
                                        value={fila.codigo} 
                                        onChange={(e) => manejarCambioFila(index, 'codigo', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione un equipo</option>
                                        {equipos.map(equipo => (
                                            <option key={equipo.id} value={equipo.codigoEquipo}>
                                                {equipo.codigoEquipo}
                                            </option>
                                        ))}
                                    </select>

                                </td>


                                <Popup content={fila.descripcion} trigger={ <td >
                                <InputText
                                    disabled
                                        value={fila.descripcion}
                                    />

                                    
                                </td>   } />

                               
                                <td style={{width:"10px"}}>
                                    <InputText
                                        
                                        disabled
                                        value={fila.stock}
                                    />
                                </td>
                                <td>
                                    {fila.cantidad > fila.stock ? 

                                        <div style={{display:"flex" , alignItems:"center"}}>
                                        <InputNumber
                                        value={fila.cantidad}
                                        onValueChange={(e) => manejarCambioFila(index, 'cantidad', e.value)}
                                        required
                                        invalid
                                        />
                                        <Icon name="exclamation circle" color="red" />
                                        
                                        </div>

                                        :
                                        <>
                                        <InputNumber
                                        value={fila.cantidad}
                                        onValueChange={(e) => manejarCambioFila(index, 'cantidad', e.value)}
                                        required
                                        />
                                        </>
                                        
                                    }
                                </td>
                                <td>
                                    <InputText
                                        value={"UND"}
                                        disabled
                                    />
                                </td>
                                <td>
                                    <InputNumber
                                    disabled
                                        value={fila.precio}
                                        required
                                    />
                                </td>
                                <td>{(fila.cantidad * fila.precio).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <Button  onClick={agregarFila} type="button"> <Icon name='plus'>  </Icon> </Button>

                {/* Condición */}
                <div className="field">
                    <h3>Método de Pago</h3>
                    <Dropdown
                        value={condicion}
                        onChange={(e) => setCondicion(e.value)}
                        options={condiciones}
                        optionLabel="name"
                        placeholder="Seleccione la Condición"
                        className="w-full md:w-14rem"
                        required
                    />
                </div>
                <div>
                    <Button primary onClick={crearCotizacion} type="button"  > Crear </Button>
               </div>
            </form>
        </div>
      <ModalActions>
       
        <Button
          content="Cerrar"
          labelPosition='right'
          icon='x'
          onClick={() => setOpenNew(false)}
        />
      </ModalActions>
    </Modal>
        
    );
};

export default NuevaCotizacion;