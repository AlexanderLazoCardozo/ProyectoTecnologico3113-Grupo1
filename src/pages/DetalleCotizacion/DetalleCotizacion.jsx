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
  Icon,
} from 'semantic-ui-react'

const DetalleCotizacion = ({ cotizacion }) => {

  const [open, setOpen] = React.useState(false);

  const subtotal = cotizacion.Equipos.reduce((acc, product) => acc + product.total, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <Modal
      style={{ width: "auto", alignItems: "center", margin: "auto" }}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button icon>
          <Icon name="eye" color="yellow" size='large' />
        </Button>
      }
    >
      <ModalHeader>Detalle Cotización</ModalHeader>
      <div>
        <img
          src={LogoEmpresa}
          alt="Logo de la Empresa"
          className="logo"
        />
        <p className="date"> Creación: {cotizacion.FechaEmision}</p>
        <div className="cotizacion-container">
          <p className="cotizacion-text">COTIZACION Nº {cotizacion.NumeroCotizacion}</p>
        </div>

        <div className="vencimiento-container">
          <p className="vencimiento-text">Vencimiento: {cotizacion.FechaVencimiento}</p>
        </div>

        <p className="section">Señores</p>
        <p className="section2">CLIENTE: {cotizacion.Cliente.nombres} </p>
        <p className="section3">RUC: {cotizacion.Cliente.ruc}</p>
        <p className="section">{cotizacion.Cliente.direccion}</p>

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

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-7px', marginRight: '10px' }}>
            <div style={{ flexDirection: 'column' }}>
              <p style={{ margin: '0' }}>Expresado en:</p>
              <p style={{ marginTop: '-40px'}}>Condiciones:</p>
            </div>
            <div style={{ marginRight: '620px' }}>
              <p style={{ margin: '0' }}>SOLES</p>
              <p style={{ marginTop: '-40px' }}>CONTADO</p>
            </div>
            <div style={{ textAlign: 'right', flexDirection: 'column', marginTop: '5px' }}>
              <p style={{ marginTop: '-10px' }}>Subtotal: S/. {subtotal.toFixed(2)}</p>
              <p style={{ marginTop: '-50px' }}>IGV 18%: S/. {igv.toFixed(2)}</p>
              <p style={{ fontWeight: 'bold', marginTop: '-50px' }}>Total: S/. {total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="cuentas-bancarias">
          <p className="subrayado">Moneda: Soles</p>
          <p>BANCO: BBVA</p>
          <p>*Cta.Cte.: 0011-0372-0100031470-06</p>
          <p>*CCI: 01137200010003147006</p>
          <p>A NOMBRE DE: SERVIFOGEL DEL PERU S.A.C.</p>
          <p>RUC: 20551020313</p>
        </div>

        <div className="observaciones">
          <div className="observaciones-text">
            <p className="observaciones-title">OBSERVACIONES:</p>
            <p className="observaciones-center">
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
