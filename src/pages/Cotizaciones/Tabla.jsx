import { Button, Icon } from "semantic-ui-react";
import DetalleCotizacion from "../DetalleCotizacion/DetalleCotizacion";

const CotizacionesTabla = ({ data, Facturar }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nro Cotización</th>
          <th>Fecha de Cotización</th>
          <th>Fecha de Vencimiento</th>
          <th>Código de Cliente</th>
          <th>Nombre de Cliente</th>
          <th>Monto Total</th>
          <th>Estado</th>
          <th>Ver</th>
          <th>Facturar</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            style={{
              backgroundColor: item.Status === "Vencida" ? "#f0f0f0" : "white",
              color: item.Status === "Vencida" ? "gray" : "inherit",
              pointerEvents: item.Status === "Vencida" ? "none" : "auto",
            }}
          >
            <td>{item.NumeroCotizacion}</td>
            <td>{item.FechaEmision}</td>
            <td>{item.FechaVencimiento}</td>
            <td>{item.CodigoCli}</td>
            {item.Cliente.razonSocial !== undefined ? (
              <td>{item.Cliente.razonSocial}</td>
            ) : (
              <td> {item.Cliente.nombres} </td>
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
                  item.Status !== "Facturado" && item.Status !== "Vencida"
                    ? () => Facturar(item)
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CotizacionesTabla;
