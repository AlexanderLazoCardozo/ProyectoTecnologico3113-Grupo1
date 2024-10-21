import React from 'react';
import './DetalleCotizacion.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LogoEmpresa from "./../../assets/fogelrs.png"
import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Image,
  Modal,
} from 'semantic-ui-react'

const DetalleCotizacion = ({cotizacion}) => {

  const [open, setOpen] = React.useState(false)

  const fecha = "miércoles, 16 de octubre de 2024";
  const cliente = "GIAN FRANCO LOZANO PEÑA";
  const ruc = "10727971403";
  const direccion = "CALLE LOS DAMASCOS 209, ATE - LIMA";
  const cotizacionTexto = "COTIZACION Nº VSFP-2024-01689";
  const vencimientoTexto = "Vencimiento: 27 de octubre de 2024";

  const productos = [
    {
      codigo: "MTR-48-FP-V1", descripcion: "MESA REFRIGERANTE 388 LITROS, TEMPERATURA 0°C A 5°C", cantidad: 1, unidad: "UND", precio: 8923.20, total: 8923.20
    },
    {
      codigo: "CR-23-A-V1", descripcion: "CONSERVADOR FULL ACERO PRE-PINTADO DE 1 PUERTA CAPACIDAD DE 680 LITROS, TEMPERATURA 0°C A 5°C", cantidad: 1, unidad: "UND", precio: 4075.17, total: 4075.17
    },
    {
      codigo: "CR-23-A-SSA-V1", descripcion: "CONSERVADOR FULL ACERO INOX. DE 1 PUERTA CAPACIDAD DE 680 LITROS, TEMPERATURA 0°C A 5°C", cantidad: 1, unidad: "UND", precio: 5195.697, total: 5195.697
    },
    {
      codigo: "VE-28-V1", descripcion: "VISICOOLER DE 2 PUERTAS CAPACIDAD DE 792 LITROS, TEMPERATURA 0°C A 4°C", cantidad: 1, unidad: "UND", precio: 4266.86, total: 4266.86
    },
    {
      codigo: "FROSTER-280-PVP-V1", descripcion: "VISIFROSTER DE 1 PUERTA CAPACIDAD DE 510 LITROS, TEMPERATURA -4°C A +4°C", cantidad: 1, unidad: "UND", precio: 3807.45, total: 3807.45
    },
  ];

  const subtotal = cotizacion.Equipos.reduce((acc, product) => acc + product.total, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <Modal
    style={{width:"auto", alignItems:"center", margin:"auto"}}
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    trigger={<Button>Ver Detalle</Button>}
  >
    <ModalHeader>Detalle Cotización</ModalHeader>
    <div>
      <img
        src={LogoEmpresa}
        alt="Logo de la Empresa"
        className="logo"
      />
      {/* Mientras no sea dinamico no lo incluyamos tiene que salir segun la fecha emision
      <p className="date">{fecha}</p> */}
      <p className="date"> Creación: {cotizacion.FechaEmision}</p>
      <div className="cotizacion-container">
        <p className="cotizacion-text">COTIZACION Nº {cotizacion.NumeroCotizacion}</p>
      </div>

      <div className="vencimiento-container">
        <p className="vencimiento-text">Vencimiento: {cotizacion.FechaVencimiento}</p>
      </div>

      <p className="section">Señores</p>
      <p className="section">CLIENTE: {cotizacion.Cliente.nombres} </p>
      <p className="section">RUC: {cotizacion.Cliente.ruc}</p>
      <p className="section">{cotizacion.Cliente.direccion}</p>

      <p className="section2">En atención a su solicitud, sírvanse encontrar nuestra Cotización según lo requerido.</p>
      <p className="section3">Quedamos a la espera de su amable respuesta confirmándonos su aceptación.</p>

      <div className="datatable-container">
      <DataTable value={cotizacion.Equipos} showGridlines>
            <Column field="codigoEquipo" header="Código" />
            <Column 
              field="descripcion" 
              header="Descripción" 
              style={{ width: '300px' }}
              bodyStyle={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }} 
            />            
            <Column field="cantidad" header="Cantidad" />
            <Column field="unidad" header="Unidad" />
            <Column field="precioUnitario" header="Precio" body={(data) => `S/. ${parseFloat(data.precioUnitario).toFixed(2)}`} />
            <Column field="total" header="Total" body={(data) => `S/. ${parseFloat(data.total).toFixed(2)}`} />
          </DataTable>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginRight: '10px' }}>
          <div style={{ flexDirection: 'column' }}>
            <p style={{ margin: '0' }}>Expresado en:</p>
            <p style={{}}>Condiciones:</p>
          </div>
          <div style={{ marginRight: '620px' }}>
            <p style={{ margin: '0' }}>SOLES</p>
            <p>CONTADO</p>
          </div>
          <div style={{ textAlign: 'right', flexDirection: 'column' }}>
            <p style={{ margin: '0' }}>Subtotal: S/. {subtotal.toFixed(2)}</p>
            <p style={{ margin: '0' }}>IGV 18%: S/. {igv.toFixed(2)}</p>
            <p style={{ fontWeight: 'bold' }}>Total: S/. {total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="cuentas-bancarias">
        <p>BANCO: BBVA</p>
        <p className="subrayado">Moneda: Soles</p>
        <p>*Cta.Cte.: 0011-0372-0100031470-06</p>
        <p>*CCI: 01137200010003147006</p>
        <p>A NOMBRE DE: SERVIFOGEL DEL PERU S.A.C.</p>
        <p>RUC: 20551020313</p>
      </div>

      <div className="observaciones">
        <div className="observaciones-text">
          <p className="observaciones-title">OBSERVACIONES:</p>
          <p className="observaciones-highlight">
            ESTIMADO CLIENTE SI SE ENCUENTRA EN PROVINCIA DEBERÁ ASUMIR LA COMISIÓN INTERPLAZA QUE SE GENERA POR DEPÓSITOS
          </p>
          <p className="observaciones-center">
            Y TRANSFERENCIAS REALIZADAS EN SU ENTIDAD BANCARIA.
          </p>
        </div>
      </div>

      <div className="informacion">
        <div className="informacion-text">
          <p className="informacion-item">NO INCLUYE REPUESTOS</p>
          <p className="informacion-item">INCLUYE TRANSPORTE (Solo Lima)</p>
        </div>
        <div className="garantia">2 AÑOS DE GARANTÍA</div>
      </div>

      <div className="descripcion">
        <div className="barra"></div>
        <div className="descripcion-text">
          <p className="descripcion-parrafo">
            FOGEL fabrica sus equipos de refrigeración bajo los estándares internacionales más altos de calidad y los respalda con una garantía de 24 meses desde la
          </p>
          <p className="descripcion-parrafo">
            fecha de despacho, bajo condiciones de uso normal de los equipos, con mantenimiento adecuado y niveles de voltaje especificados. Los componentes
          </p>
          <p className="descripcion-parrafo">
            dañados bajo el período de garantía serán repuestos por FOGEL, excluyéndose los gastos de mano de obra y materiales adicionales.
          </p>
        </div>
      </div>

      <div className="contacto">
      <div className="barra"></div>
        <div className="contacto-text">
          <p className="contacto-item">Tlf.: 986330169</p>
          <p className="contacto-item">E-Mail: ventasperu@servifogel.com</p>
        </div>
      </div>

    </div>
    <ModalActions>
     
      <Button
        content="Cerrar"
        labelPosition='right'
        icon='x'
        onClick={() => setOpen(false)}
        negative
      />
    </ModalActions>
  </Modal>
    
  );
}

export default DetalleCotizacion;