import React, { useState, useEffect } from "react";
import { Button, Modal } from "semantic-ui-react";
import firebaseApp from "../../firebase/credenciales";
import LogoEmpresa from "./../../assets/factura-foguel.png";
import "../Facturas/Factura.css";
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

const NuevaFactura = ({ factura, onClose, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState("");

  const fechaHoy = new Date().toISOString().split("T")[0];
  const Moneda = "Soles";

  // Factura
  const generateInvoiceNumber = async () => {
    const invoicesRef = collection(firestore, "FacturacionOficial");
    const snapshot = await getDocs(invoicesRef);
    const invoiceCount = snapshot.size;
    const newInvoiceNumber = `FAC-${String(invoiceCount + 1).padStart(3, "0")}`;
    setNumeroFactura(newInvoiceNumber);
  };

  useEffect(() => {
    generateInvoiceNumber();
  }, []);

  // Calcular subtotal, IGV y total
  const subtotal = factura.Equipos.reduce(
    (acc, equipo) => acc + equipo.total,
    0
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clienteData = {
        direccion: factura.Cliente.direccion,
        ruc: factura.Cliente.ruc,
        CodigoCli: factura.CodigoCli,
        razonSocial: factura.Cliente.razonSocial || undefined, // Usa razonSocial si existe; de lo contrario, será undefined
        nombres: factura.Cliente.razonSocial
          ? undefined
          : factura.Cliente.nombres, // Usa nombres solo si razonSocial no existe
      };

      // Eliminar campos undefined de clienteData
      Object.keys(clienteData).forEach((key) => {
        if (clienteData[key] === undefined) {
          delete clienteData[key];
        }
      });

      await addDoc(collection(firestore, "FacturacionOficial"), {
        Cliente: clienteData,
        Equipos: factura.Equipos.map((equipo) => ({
          cantidad: equipo.cantidad,
          codigoEquipo: equipo.codigoEquipo,
          descripcion: equipo.descripcion,
          precioUnitario: equipo.precioUnitario,
          total: equipo.total,
          unidad: equipo.unidad,
        })),
        FechaEmision: fechaHoy,
        FechaVencimiento: fechaHoy,
        SubTotal: subtotal,
        IGV: igv,
        MontoTotal: total,
        Moneda: Moneda,
        NumeroCotizacion: factura.NumeroCotizacion,
        NumeroFactura: numeroFactura,
      });

      const cotizacionesRef = collection(firestore, "DataCotizaciones");
      const q = query(
        cotizacionesRef,
        where("NumeroCotizacion", "==", factura.NumeroCotizacion)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        await updateDoc(docSnap.ref, {
          Status: "Facturado",
        });
        console.log("'Facturado'");
        onUpdateStatus();
      } else {
        console.log("No se econtro el Codigo");
      }
      onClose();
    } catch (error) {
      alert("Error al guardar la factura: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} centered={true}>
      <Modal.Header className="modal-header">
        <img src={LogoEmpresa} alt="Logo de la Empresa" className="logo" />
        <div className="header-right">
          <div className="boleta-info">Factura Electrónica</div>
          <div className="ruc-info">RUC: {factura.Cliente.ruc}</div>
          <div className="codigo-boleta">{numeroFactura}</div>
        </div>
      </Modal.Header>
      <Modal.Content className="modal-content">
        <div className="grid-container">
          <div className="grid-item label">RUC: {factura.Cliente.ruc}</div>
          <div className="grid-item label">
            Cliente:
            {factura.Cliente.razonSocial ? (
              factura.Cliente.razonSocial
            ) : (
              <>{factura.Cliente.nombres}</>
            )}
          </div>
          <div className="grid-item label">
            Dirección: {factura.Cliente.direccion}
          </div>
          <div className="grid-item label">Moneda: {Moneda}</div>
          <div className="grid-item label">Fecha de Emisión: {fechaHoy}</div>
          <div className="grid-item label">
            Fecha de Vencimiento: {fechaHoy}
          </div>
        </div>

        <div className="grid-header">Detalles del Equipo</div>
        <div className="table-container">
          <div className="table-header">
            <div className="table-item">Código</div>
            <div className="table-item">Cantidad</div>
            <div className="table-item">Descripción</div>
            <div className="table-item">Precio Unitario</div>
            <div className="table-item">Importe</div>
          </div>

          {factura.Equipos.map((equipo, index) => (
            <div key={index} className="table-row">
              <div className="table-item">{equipo.codigoEquipo}</div>
              <div className="table-item">{equipo.cantidad}</div>
              <div className="table-item">{equipo.descripcion}</div>
              <div className="table-item">s/{equipo.precioUnitario}</div>
              <div className="table-item">s/{equipo.total}</div>
            </div>
          ))}
        </div>

        <div className="grid-container">
          <div className="grid-item label">Observaciones:</div>
          <div className="grid-item">
            Cotización N° {factura.NumeroCotizacion}
          </div>

          <div className="grid-item label total-label">Total Gravada:</div>
          <div className="grid-item total-value">s/{subtotal.toFixed(2)}</div>
          <div className="grid-item label total-label">Total IGV 18%</div>
          <div className="grid-item total-value">s/{igv.toFixed(2)}</div>
          <div className="grid-item label total-label">Importe Total</div>
          <div className="grid-item total-value">s/{total.toFixed(2)}</div>
        </div>

        <Button
          type="submit"
          className="factura-btn"
          primary
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
        >
          Facturar
        </Button>
      </Modal.Content>
    </Modal>
  );
};

export default NuevaFactura;
