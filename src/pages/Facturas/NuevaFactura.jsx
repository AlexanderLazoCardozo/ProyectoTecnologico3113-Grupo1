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
  limit,
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

  const manageEquipos = async () => {
    for (let i = 0; i < factura.Equipos.length; i++) {
      let codigoE = factura.Equipos[i].codigoEquipo;
      let cant = factura.Equipos[i].cantidad;

      console.log("Equipos Codigo: ", factura.Equipos[i].codigoEquipo);
      console.log("Equipos Cantidad: ", factura.Equipos[i].cantidad);

      const q = query(
        collection(firestore, "EquipoAlmacen"),
        where("codigoProducto", "==", codigoE),
        where("status", "==", "En Almacen"),
        limit(cant)
      );

      const querySnap = await getDocs(q);

      //verificar que existe cantidad exacta segun limit
      if (querySnap.docs.length == cant) {
        console.log("Existen", querySnap.docs.length);
        console.log("ID", querySnap.docs.length);
      } else {
        console.log("No existen", querySnap);
      }

      //extraer id de documentos
      querySnap.docs.forEach((doc) => {
        console.log("ID", doc.ref);

        try {
          updateDoc(doc.ref, {
            status: "Despachado",
            UltimoPoseedor: factura.CodigoCli,
          });

          console.log("Actualizado");
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clienteData = {
        direccion: factura.Cliente.direccion,
        ruc: factura.Cliente.ruc,
        CodigoCli: factura.CodigoCli,
        tipoDocumento: factura.Cliente.tipoDocumento,
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

      manageEquipos();

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
          <div className="ruc-info">RUC: 20551020313</div>
          <div className="boleta-info">
            {factura.Cliente.tipoDocumento != "RUC" ? "Boleta" : "Factura"}{" "}
            Electrónica
          </div>
          <div className="codigo-boleta">{numeroFactura}</div>
        </div>
      </Modal.Header>

      <div class="cabezal">
        <br></br>
        Direccion Fiscal: CAL. SANTA LUCIA NRO. 336 URB. INDUSTRIAL LA AURORA ;
        <br></br>
        LIMA - LIMA - ATE
        <br></br>
        <br></br>
        Dirección de establecimiento: CALLE SANTA LUCIA 336
        <br></br>
        <br></br>
        Ate - Lima - Lima
        <br></br>
        <br></br>
        E-mail: chuisa@servifogel.com / abustamante@servifogel.com /<br></br>
        gvalverde@servidogel.com
      </div>

      <Modal.Content className="modal-content">
        <div className="grid-container">
          <div className="grid-item label">
            {factura.Cliente.tipoDocumento != "RUC" ? "Documento" : "RUC"}:{" "}
            {factura.Cliente.ruc}
          </div>
          <div className="grid-item label">
            Cliente:
            {factura.Cliente.razonSocial ? (
              factura.Cliente.razonSocial
            ) : (
              <>{factura.Cliente.nombres}</>
            )}
          </div>
          <div>
            <strong>Fecha de Emisión: </strong>
            {fechaHoy}
          </div>
          <div>
            <strong>Fecha de Vencimiento: </strong>
            {fechaHoy}
          </div>
        </div>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {factura.Equipos.map((equipo, index) => (
              <tr key={index}>
                <td data-label="Cantidad">{equipo.cantidad}</td>
                <td data-label="Código">{equipo.codigoEquipo}</td>
                <td data-label="Descripción">{equipo.descripcion}</td>
                <td data-label="Precio Unitario">S/{equipo.precioUnitario}</td>
                <td data-label="Importe">S/{equipo.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="MasterCont">
          <div className="SemiMaster">
            <div className="grid-container2">
              <div className="">Observaciones:</div>
              <div className="">Cotización N° {factura.NumeroCotizacion}</div>
            </div>
            <div className="grid-container2">
              BBVA - BANCO CONTINENTAL
              <br></br>
              Dolares Cta. Corriente: 0011-0372-0100031470-06
              <br></br>
              CCI: 01137200010003147006
              <br></br>
              Soles Cta.Corriente: 011-0372-0100033112-02
              <br></br>
              CCI: 01137200010003311202
            </div>
          </div>

          {factura.Cliente.tipoDocumento != "RUC" ? (
            <>
              {" "}
              <div className="SemiMaster2">
                <div class="salidas">
                  <div className="salidasc">Importe Total (Incluye IGV)</div>
                  <div className="salidasc">S/</div>
                  <div className="salidasc">{total.toFixed(2)}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="SemiMaster2">
                <div class="salidas">
                  <div className="salidasc">Total Op. Gravada</div>
                  <div className="salidasc">S/</div>
                  <div className="salidasc">{subtotal.toFixed(2)}</div>
                </div>
                <div class="salidas">
                  <div className="salidasc">Total IGV 18%</div>
                  <div className="salidasc">S/</div>
                  <div className="salidasc">{igv.toFixed(2)}</div>
                </div>
                <div class="salidas">
                  <div className="salidasc">Importe Total</div>
                  <div className="salidasc">S/</div>
                  <div className="salidasc">{total.toFixed(2)}</div>
                </div>
              </div>
            </>
          )}
        </div>
        <div class="lineadivisoria">
          <p>
            Representación impresa del Comprobante Electrónico puede ser
            <br></br>
            consultado en https://proyecto-tecnologico3113-grupo1.vercel.app/
            <br></br>
            AUTORIZADO MEDIANTE RESOLUCION DE INTENDENCIA -
            N°034-005-0011914/SUNAT
          </p>
        </div>
        <br></br>

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
        {/* <Button onClick={manageEquipos}>Ver</Button> */}
      </Modal.Content>
    </Modal>
  );
};

export default NuevaFactura;
