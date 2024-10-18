import { Button } from "semantic-ui-react";

const CotizacionesTabla = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nro Cotizacion</th>
          <th>Fecha de Cotizacion</th>
          <th>Fecha de Vencimiento</th>
          <th>Codigo de Cliente</th>
          <th>Nombre de Cliente</th>
          <th>Monto Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.codigo}</td>
            <td>{item.fechaEmision}</td>
            <td>{item.fechaVencimiento}</td>
            <td>{item.clienteNumero}</td>
            <td>{item.clienteNombre}</td>
            <td>{item.MontoTotal}</td>
            <td>{item.estado}</td>
            <td>
              <Button>Ver Detalle</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CotizacionesTabla;
