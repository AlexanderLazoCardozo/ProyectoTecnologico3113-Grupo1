import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import logo from './assets/LogoFogel.png';
import './app.css';

const Formulario = () => {
    const [nombres, setNombres] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [rucCliente, setRucCliente] = useState('');
    const [direccionCliente, setDireccionCliente] = useState('');
    const [condicion, setCondicion] = useState(null);
    const [filas, setFilas] = useState([{ codigo: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 }]);
    const toast = useRef(null);

    const condiciones = [
        { name: 'Contado', code: 'contado' },
        { name: 'Crédito', code: 'credito' }
    ];

    const manejarEnvio = async (e) => {
        e.preventDefault();

        const RUC_REGEX = /^\d{11}$/;
        if (!RUC_REGEX.test(rucCliente)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'RUC debe contener 11 caracteres' });
            return;
        }


        const data = {
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            rucCliente,
            direccionCliente,
            filas,
            condicion,
        };

        try {
            const response = await fetch('____', {  // URL Colrcanle
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Datos enviados correctamente' });                
                setNombres('');
                setApellidoPaterno('');
                setApellidoMaterno('');
                setRucCliente('');
                setDireccionCliente('');
                setCondicion(null);
                setFilas([{ codigo: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 }]);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error al enviar datos' });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar datos' });
        }
    };



    const agregarFila = () => {
        setFilas([...filas, { codigo: '', descripcion: '', cantidad: 0, unidad: '', precio: 0 }]);
    };

    const manejarCambioFila = (index, campo, valor) => {
        const nuevaFilas = [...filas];
        nuevaFilas[index][campo] = valor;
        setFilas(nuevaFilas);
    };

    return (
        <div className="card">
            <img src={logo} alt="Logo" className="logo" />
            <Toast ref={toast} />
            <h1>Cotización</h1>
            <form onSubmit={manejarEnvio}>
                {/* Datos del Cliente */}

                <h3>Datos del Cliente</h3>
                <div className="p-grid">
                    <div className="p-col">
                        <div className="field">
                            <label htmlFor="rucCliente">RUC</label>
                            <InputText
                                id="rucCliente"
                                value={rucCliente}
                                onChange={(e) => setRucCliente(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                                maxLength={11}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="flex-item">
                            <label htmlFor="nombres">Nombres</label>
                            <InputText id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
                        </div>

                        <div className="flex-item">
                            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                            <InputText id="apellidoPaterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} required />
                        </div>

                        <div className="flex-item">
                            <label htmlFor="apellidoMaterno">Apellido Materno</label>
                            <InputText id="apellidoMaterno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} required />
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="direccionCliente">Dirección</label>
                    <InputText id="direccionCliente" value={direccionCliente} onChange={(e) => setDireccionCliente(e.target.value)} required />
                </div>

                <h3>Datos del Equipo</h3>
                <table className="p-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((fila, index) => (
                            <tr key={index}>
                                <td>
                                    <InputText
                                        value={fila.codigo}
                                        onChange={(e) => manejarCambioFila(index, 'codigo', e.target.value)}
                                        required
                                    />
                                    
                                </td>
                                <td>
                                    <InputText
                                        value={fila.descripcion}
                                        onChange={(e) => manejarCambioFila(index, 'descripcion', e.target.value)}
                                        required
                                    />
                                </td>
                                <td>
                                    <InputNumber
                                        value={fila.cantidad}
                                        onValueChange={(e) => manejarCambioFila(index, 'cantidad', e.value)}
                                        required
                                    />
                                </td>
                                <td>
                                    <InputText
                                        value={fila.unidad}
                                        onChange={(e) => manejarCambioFila(index, 'unidad', e.target.value)}
                                        required
                                    />
                                </td>
                                <td>
                                    <InputNumber
                                        value={fila.precio}
                                        onValueChange={(e) => manejarCambioFila(index, 'precio', e.value)}
                                        required
                                    />
                                </td>
                                <td>{(fila.cantidad * fila.precio).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <Button icon="pi pi-plus" label="+" onClick={agregarFila} type="button"/>

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
                    <Button className="yellow-button" type="Submit" label="Enviar" />
                </div>
            </form>
        </div>
    );
};

export default Formulario;