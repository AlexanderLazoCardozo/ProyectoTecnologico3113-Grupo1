import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import firebaseApp from "../../firebase/credenciales";
import {
  getDocs,
  collection,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import DataTable from "react-data-table-component";
import {
  Container,
  Grid,
  Segment,
  Header,
  Icon,
  Input,
  Card,
  List,
  Button,
  Modal,
  Divider,
  ModalHeader,
  ModalContent,
  ModalActions,
} from "semantic-ui-react";
import NavTab from "../../components/NavTab";
import LogoEmpresa from "./../../assets/factura-foguel.png";

const firestore = getFirestore(firebaseApp);

const TablaFacturas = ({ user }) => {
  const [openDetallF, setOpenDetallF] = useState(false);
  const [facturasGenerales, setFacturasGenerales] = useState([]);

  const facturasCall = async () => {
    const query = collection(firestore, "FacturacionOficial");

    const getQuery = await getDocs(query);

    getQuery.forEach((doc) => {
      setFacturasGenerales((prev) => [...prev, doc.data()]);
    });

    console.log(facturasGenerales);
  };

  return (
    <NavTab user={user}>
      <Card style={{ margin: "20px", width: "auto", padding: "20px" }}>
        <Header as="h1">Facturas</Header>
        <div>
          <Button color="yellow" onClick={facturasCall}>
            Conectar Facturas
          </Button>
        </div>
        <br />
        <Container style={{ maxHeight: "auto", overflowY: "auto" }}>
          <DataTable
            columns={[
              {
                name: "N° Factura",
                selector: (row) => row.NumeroFactura,
                sortable: true,
              },
              {
                name: "N° Cotizacion",
                selector: (row) => row.NumeroCotizacion,
                sortable: true,
              },
              {
                name: "Cliente",
                selector: (row) => row.Cliente.CodigoCli,
                sortable: true,
              },
              {
                name: "MontoTotal",
                selector: (row) => row.MontoTotal,
                sortable: true,
              },
              {
                name: "Fecha Emision",
                selector: (row) => row.FechaEmision,
                sortable: true,
              },
              {
                name: "Fecha Vencimiento",
                selector: (row) => row.FechaEmision,
                sortable: true,
              },
              {
                name: "Acciones",
                selector: (row) => (
                  <Modal
                    onClose={() => setOpenDetallF(false)}
                    onOpen={() => setOpenDetallF(true)}
                    open={openDetallF}
                    trigger={<Button>Ver</Button>}
                  >
                    <Modal.Header className="modal-header">
                      <img
                        src={LogoEmpresa}
                        alt="Logo de la Empresa"
                        className="logo"
                      />
                      <div className="header-right">
                        <div className="ruc-info">RUC: 20551020313</div>
                        <div className="boleta-info">
                          {row.Cliente.tipoDocumento != "RUC"
                            ? "Boleta"
                            : "Factura"}{" "}
                          Electrónica
                        </div>
                        <div className="codigo-boleta">{row.NumeroFactura}</div>
                      </div>
                    </Modal.Header>

                    <div class="cabezal">
                      <br></br>
                      Direccion Fiscal: CAL. SANTA LUCIA NRO. 336 URB.
                      INDUSTRIAL LA AURORA ;<br></br>
                      LIMA - LIMA - ATE
                      <br></br>
                      <br></br>
                      Dirección de establecimiento: CALLE SANTA LUCIA 336
                      <br></br>
                      <br></br>
                      Ate - Lima - Lima
                      <br></br>
                      <br></br>
                      E-mail: chuisa@servifogel.com / abustamante@servifogel.com
                      /<br></br>
                      gvalverde@servidogel.com
                    </div>

                    <ModalContent className="modal-content">
                      <div className="grid-container">
                        <div className="grid-item label">
                          {row.Cliente.tipoDocumento != "RUC"
                            ? "Documento"
                            : "RUC"}
                          : {row.Cliente.ruc}
                        </div>
                        <div className="grid-item label">
                          Cliente:
                          {row.Cliente.razonSocial ? (
                            row.Cliente.razonSocial
                          ) : (
                            <>{row.Cliente.nombres}</>
                          )}
                        </div>
                        <div>
                          <strong>Fecha de Emisión: </strong>
                          {row.FechaEmision}
                        </div>
                        <div>
                          <strong>Fecha de Vencimiento: </strong>
                          {row.FechaVencimiento}
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
                          {row.Equipos.map((equipo, index) => (
                            <tr key={index}>
                              <td data-label="Cantidad">{equipo.cantidad}</td>
                              <td data-label="Código">{equipo.codigoEquipo}</td>
                              <td data-label="Descripción">
                                {equipo.descripcion}
                              </td>
                              <td data-label="Precio Unitario">
                                S/{equipo.precioUnitario}
                              </td>
                              <td data-label="Importe">S/{equipo.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="MasterCont">
                        <div className="SemiMaster">
                          <div className="grid-container2">
                            <div className="">Observaciones:</div>
                            <div className="">
                              Cotización N° {row.NumeroCotizacion}
                            </div>
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

                        {row.Cliente.tipoDocumento != "RUC" ? (
                          <>
                            {" "}
                            <div className="SemiMaster2">
                              <div class="salidas">
                                <div className="salidasc">
                                  Importe Total (Incluye IGV)
                                </div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {row.MontoTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className="SemiMaster2">
                              <div class="salidas">
                                <div className="salidasc">
                                  Total Op. Gravada
                                </div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {row.SubTotal.toFixed(2)}
                                </div>
                              </div>
                              <div class="salidas">
                                <div className="salidasc">Total IGV 18%</div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {row.IGV.toFixed(2)}
                                </div>
                              </div>
                              <div class="salidas">
                                <div className="salidasc">Importe Total</div>
                                <div className="salidasc">S/</div>
                                <div className="salidasc">
                                  {row.MontoTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div class="lineadivisoria">
                        <p>
                          Representación impresa del Comprobante Electrónico
                          puede ser
                          <br></br>
                          consultado en
                          https://proyecto-tecnologico3113-grupo1.vercel.app/
                          <br></br>
                          AUTORIZADO MEDIANTE RESOLUCION DE INTENDENCIA -
                          N°034-005-0011914/SUNAT
                        </p>
                      </div>
                      <br></br>
                    </ModalContent>
                    <ModalActions>
                      <Button
                        color="black"
                        onClick={() => setOpenDetallF(false)}
                      >
                        Cerrar
                      </Button>
                    </ModalActions>
                  </Modal>
                ),
                sortable: true,
              },
            ]}
            data={facturasGenerales}
            pagination
          />
        </Container>
      </Card>
    </NavTab>
  );
};

export default TablaFacturas;
