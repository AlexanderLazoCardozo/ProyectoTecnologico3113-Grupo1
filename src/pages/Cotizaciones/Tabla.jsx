import { Button, Icon, Modal } from "semantic-ui-react";
import DetalleCotizacion from "../DetalleCotizacion/DetalleCotizacion";
import { useMemo, useState } from "react";
import DropdownFiltro from "../../components/Tabla/DropdownFiltro";

const CotizacionesTabla = ({ data, setSelectedCotizacion, Eliminar }) => {
  const [codClienteFiltro, setCodClienteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaCotizacionFiltro, setFechaCotizacionFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dataFiltrada = useMemo(
    () =>
      data.filter(
        (row) =>
          (codClienteFiltro ? row.CodigoCli === codClienteFiltro : true) &&
          (estadoFiltro ? row.Status === estadoFiltro : true) &&
          (fechaCotizacionFiltro
            ? row.FechaEmision === fechaCotizacionFiltro
            : true)
      ),
    [data, codClienteFiltro, estadoFiltro, fechaCotizacionFiltro]
  );

  const handleEliminarClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const confirmEliminar = () => {
    Eliminar(selectedItem);
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="small">
        <Modal.Header>Confirmar eliminación</Modal.Header>
        <Modal.Content>
          <p>¿Realmente deseas eliminar la cotización?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)} negative>
            No
          </Button>
          <Button
            onClick={confirmEliminar}
            positive
            icon="checkmark"
            labelPosition="right"
            content="Sí"
          />
        </Modal.Actions>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>Nro Cotización</th>
            <th>
              <DropdownFiltro
                tableData={data}
                header="Fecha de Cotizacion"
                campo="FechaEmision"
                setFiltro={setFechaCotizacionFiltro}
              />
            </th>
            <th>Fecha de Vencimiento</th>
            <th>Código de Cliente</th>
            <th>Nombre de Cliente</th>
            <th>Monto Total</th>
            <th>
              <DropdownFiltro
                tableData={data}
                header="Estado"
                campo="Status"
                setFiltro={setEstadoFiltro}
              />
            </th>
            <th>Ver</th>
            <th>Facturar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {dataFiltrada.map((item, index) => (
            <tr
              key={index}
              style={{
                backgroundColor:
                  item.Status === "Vencida" ? "#f0f0f0" : "white",
                color: item.Status === "Vencida" ? "gray" : "inherit",
                pointerEvents: item.Status === "Vencida" ? "none" : "auto",
              }}
            >
              <td>{item.NumeroCotizacion}</td>
              <td>{item.FechaEmision}</td>
              <td>{item.FechaVencimiento}</td>
              <td>{item.CodigoCli}</td>
              {item.Cliente.razonSocial != undefined ? (
                <td>{item.Cliente.razonSocial}</td>
              ) : (
                <td>{item.Cliente.nombres}</td>
              )}
              <td>{item.MontoTotal}</td>
              <td>{item.Status}</td>
              <td>
                <DetalleCotizacion cotizacion={item} />
              </td>
              <td>
                <Button
                  icon
                  onClick={
                    item.Status !== "Facturado"
                      ? () => setSelectedCotizacion(item)
                      : null
                  }
                  disabled={
                    item.Status === "Facturado" || item.Status === "Vencida"
                  }
                >
                  <Icon
                    name="file invoice"
                    style={{
                      color:
                        item.Status === "Facturado" || item.Status === "Vencida"
                          ? "gray"
                          : "black",
                    }}
                  />
                </Button>
              </td>
              <td>
                <Button
                  icon
                  onClick={() => handleEliminarClick(item)}
                  disabled={
                    item.Status === "Facturado" || item.Status === "Vencida"
                  }
                >
                  <Icon name="trash" style={{ color: "red" }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CotizacionesTabla;
