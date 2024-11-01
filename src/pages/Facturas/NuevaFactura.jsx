import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import firebaseApp from '../../firebase/credenciales';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firestore = getFirestore(firebaseApp);

const NuevaFactura = ({ factura, onClose, onUpdateStatus }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Guarda la nueva factura
            await addDoc(collection(firestore, "FacturacionOficial"), {
                Cliente: {
                    direccion: factura.Cliente.direccion,
                    nombres: factura.Cliente.nombres,
                    ruc: factura.Cliente.ruc,
                    CodigoCli: factura.CodigoCli,
                },
                Equipos: factura.Equipos.map(equipo => ({
                    cantidad: equipo.cantidad,
                    codigoEquipo: equipo.codigoEquipo,
                    descripcion: equipo.descripcion,
                    precioUnitario: equipo.precioUnitario,
                    total: equipo.total,
                    unidad: equipo.unidad,
                })),
                FechaEmision: factura.FechaEmision,
                FechaVencimiento: factura.FechaVencimiento,
                MontoTotal: factura.MontoTotal,
                NumeroCotizacion: factura.NumeroCotizacion,
            });
            alert("Factura guardada con éxito");

            // Cambia el estado de la cotización a "Facturado"
            const cotizacionRef = doc(firestore, "DataCotizaciones", factura.NumeroCotizacion);            
         
            const docSnap = await getDoc(cotizacionRef);
            if (docSnap.exists()) {
                await updateDoc(cotizacionRef, {
                    Status: "Facturado",
                });
                alert("actualizado a 'Facturado'");
                onUpdateStatus(); 
            } else {
                alert("No se encontró la cotización con el ID proporcionado.");
            }
            onClose(); 
        } catch (error) {
            alert("Error al guardar la factura: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={true} onClose={onClose} centered>
            <Modal.Header>Detalles de la Factura</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <label>Código Cliente</label>
                        <input value={factura.CodigoCli} readOnly />
                    </Form.Field>
                    <Form.Field>
                        <label>Nombre Cliente</label>
                        <input value={factura.Cliente.nombres} readOnly />
                    </Form.Field>
                    <Form.Field>
                        <label>Monto Total</label>
                        <input type="number" value={factura.MontoTotal} readOnly />
                    </Form.Field>
                    <Button type='submit' primary loading={loading} disabled={loading}>
                        Facturar
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default NuevaFactura;
