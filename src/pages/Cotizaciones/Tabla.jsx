import { Button, Icon } from "semantic-ui-react";
import DetalleCotizacion from "../DetalleCotizacion/DetalleCotizacion";

const CotizacionesTabla = ({ data, Facturar, Eliminar }) => {
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
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
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
                onClick={item.Status !== "Facturado" ? () => Facturar(item) : null}
                disabled={item.Status === "Facturado" || item.Status === "Vencida"}
              >
                <Icon
                  name="file invoice"
                  style={{
                    color: item.Status === "Facturado" || item.Status === "Vencida" ? "gray" : "black",
                  }}
                />
              </Button>
            </td>
            <td>
              <Button
                icon
                onClick={() => Eliminar(item)} 
                disabled={item.Status === "Facturado" || item.Status === "Vencida"} 
              >
                <Icon name="trash" style={{ color: "red" }} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CotizacionesTabla;