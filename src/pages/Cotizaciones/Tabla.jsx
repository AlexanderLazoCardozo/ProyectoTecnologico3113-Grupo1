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
          <tr key={index}>
            <td>{item.NumeroCotizacion}</td>
            <td>{item.FechaEmision}</td>
            <td>{item.FechaVencimiento}</td>
            <td>{item.CodigoCli}</td>
            <td>{item.Cliente.nombres}</td>
            <td>{item.MontoTotal}</td>
            <td>{item.Status}</td>
            <td>
              <DetalleCotizacion cotizacion={item} />
            </td>
            <td>               
              <Button icon onClick={() => Facturar(item)}>
                <Icon name="file invoice" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CotizacionesTabla;
