import React, { useState, useEffect, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import firebaseApp from "../../firebase/credenciales";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import {
  Container,
  Header,
  Card,
  Button,
  Modal,
  ModalContent,
  ModalActions,
} from "semantic-ui-react";
import NavTab from "../../components/NavTab";
import LogoEmpresa from "./../../assets/factura-foguel.png";
import DropdownFiltro from "../../components/Tabla/DropdownFiltro";
import Buscador from "../../components/Buscador";
import html2pdf from "html2pdf.js";

const firestore = getFirestore(firebaseApp);

const TablaFacturas = ({ user }) => {
  const [openDetallF, setOpenDetallF] = useState(null);
  const [codClienteFiltro, setCodClienteFiltro] = useState("");
  const [fechaEmisionFiltro, setFechaEmisionFiltro] = useState("");
  const [facturasGenerales, setFacturasGenerales] = useState([]);
  const [facturasBuscadas, setFacturasBuscadas] = useState([]);

  const facturasCall = async () => {
    const query = collection(firestore, "FacturacionOficial");
    const getQuery = await getDocs(query);
    const facturas = [];
    getQuery.forEach((doc) => {
      facturas.push(doc.data());
    });
    setFacturasGenerales(facturas);
    setFacturasBuscadas(facturas);
  };

  const handleModalOpen = (index) => {
    setOpenDetallF(index);
  };

  const handleModalClose = () => {
    setOpenDetallF(null);
  };

  const downloadPDF = (index) => {
    const element = document.getElementById(`factura-modal-container-${index}`);

    if (!element) {
      console.error("No se encontró el contenedor del modal.");
      return;
    }

    const options = {
      margin: [10, 10, 10, 10],
      filename: `${facturasFiltradas[index].NumeroFactura}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  useEffect(() => {
    facturasCall();
  }, []);

  const facturasFiltradas = useMemo(
    () =>
      facturasBuscadas.filter(
        (row) =>
          (codClienteFiltro
            ? row.Cliente.CodigoCli === codClienteFiltro
            : true) &&
          (fechaEmisionFiltro ? row.FechaEmision === fechaEmisionFiltro : true)
      ),
    [facturasBuscadas, codClienteFiltro, fechaEmisionFiltro]
  );

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Facturas</Header>
        <div>
          <Buscador
            campo="NumeroFactura"
            lista={facturasGenerales}
            setListaFiltrada={setFacturasBuscadas}
            placeholder="Buscar en Facturas..."
          />
        </div>
        <br />
        <Container style={{ maxHeight: "auto", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>N° Factura</th>
                <th>N° Cotizacion</th>
                <th>Código de Cliente</th>
                <th>Monto Total</th>
                <th>
                  <DropdownFiltro
                    header="Fecha de Emision"
                    campo="FechaEmision"
                    tableData={facturasGenerales}
                    setFiltro={setFechaEmisionFiltro}
                  />
                </th>
                <th>Fecha Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map((item, index) => (
                <tr key={index}>
                  <td>{item.NumeroFactura}</td>
                  <td>{item.NumeroCotizacion}</td>
                  <td>{item.Cliente.CodigoCli}</td>
                  <td>{item.MontoTotal.toFixed(2)}</td>
                  <td>{item.FechaEmision}</td>
                  <td>{item.FechaVencimiento}</td>
                  <td>
                    <Modal
                      onClose={handleModalClose}
                      onOpen={() => handleModalOpen(index)}
                      open={openDetallF === index}
                      trigger={<Button>Ver</Button>}
                    >
                      <div id={`factura-modal-container-${index}`}>
                        <Modal.Header className="modal-header">
                          <img
                            src={LogoEmpresa}
                            alt="Logo de la Empresa"
                            className="logo"
                          />
                          <div className="header-right">
                            <div className="ruc-info">RUC: 20551020313</div>
                            <div className="boleta-info">
                              {item.Cliente.tipoDocumento !== "RUC"
                                ? "Boleta"
                                : "Factura"}{" "}
                              Electrónica
                            </div>
                            <div className="codigo-boleta">
                              {item.NumeroFactura}
                            </div>
                          </div>
                        </Modal.Header>

                        <div className="cabezal">
                          Dirección Fiscal: CAL. SANTA LUCIA NRO. 336 URB.
                          INDUSTRIAL LA AURORA;
                          <br />
                          LIMA - LIMA - ATE
                          <br />
                          <br />
                          Dirección de establecimiento: CALLE SANTA LUCIA 336
                          <br />
                          Ate - Lima - Lima
                          <br />
                          E-mail: chuisa@servifogel.com /
                          abustamante@servifogel.com / gvalverde@servidogel.com
                        </div>

                        <ModalContent className="modal-content">
                          <div className="grid-container">
                            <div className="grid-item label">
                              {item.Cliente.tipoDocumento !== "RUC"
                                ? "Documento"
                                : "RUC"}{" "}
                              : {item.Cliente.ruc}
                            </div>
                            <div className="grid-item label">
                              Cliente:{" "}
                              {item.Cliente.razonSocial
                                ? item.Cliente.razonSocial
                                : item.Cliente.nombres}
                            </div>
                            <div>
                              <strong>Fecha de Emisión: </strong>
                              {item.FechaEmision}
                            </div>
                            <div>
                              <strong>Fecha de Vencimiento: </strong>
                              {item.FechaVencimiento}
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
                              {item.Equipos.map((equipo, index) => (
                                <tr key={index}>
                                  <td>{equipo.cantidad}</td>
                                  <td>{equipo.codigoEquipo}</td>
                                  <td>{equipo.descripcion}</td>
                                  <td>{equipo.precioUnitario}</td>
                                  <td>{equipo.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="MasterCont">
                            <div className="SemiMaster">
                              <div className="grid-container2">
                                <div className="">Observaciones:</div>
                                <div className="">
                                  Cotización N° {item.NumeroCotizacion}
                                </div>
                              </div>
                            </div>

                            <div className="SemiMaster2">
                              <div className="salidas">
                                <div className="salidasc">
                                  Total Op. Gravada
                                </div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {item.SubTotal.toFixed(2)}
                                </div>
                              </div>
                              <div className="salidas">
                                <div className="salidasc">Total IGV 18%</div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {item.IGV.toFixed(2)}
                                </div>
                              </div>
                              <div className="salidas">
                                <div className="salidasc">Importe Total</div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {item.MontoTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="lineadivisoria">
                            <p>
                              Representación impresa del Comprobante Electrónico
                              puede ser consultado en
                              https://proyecto-tecnologico3113-grupo1.vercel.app/
                              <br />
                              AUTORIZADO MEDIANTE RESOLUCION DE INTENDENCIA -
                              N°034-005-0011914/SUNAT
                            </p>
                          </div>
                          <br />
                        </ModalContent>
                      </div>
                      <ModalActions>
                        <Button color="blue" onClick={() => downloadPDF(index)}>
                          Descargar Factura
                        </Button>
                        <Button color="red" onClick={handleModalClose}>
                          Cerrar
                        </Button>
                      </ModalActions>
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </Card>
    </NavTab>
  );
};

export default TablaFacturas;
