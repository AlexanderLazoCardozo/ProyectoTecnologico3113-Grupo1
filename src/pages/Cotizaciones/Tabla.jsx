import { Button } from "semantic-ui-react";

const CotizacionesTabla = ({ data }) => {

  /* CORRECCIONES:
   SE DEBIO HABER HECHO EN REACT DATA TABLE - COMO SE INDICO Y NO SOLO EN UN TABLE

  */

  return (
    <table>
      <thead>
        <tr>
          <th>Nro Cotizacion</th>
          <th>Fecha de Cotización</th>
          <th>Fecha de Vencimiento</th>
          <th>Codigo de Cliente</th>
          <th>Nombre de Cliente</th>
          <th>Monto Total</th>
          {/* <th>Estado</th> */}
          <th>Acciones</th>
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
            {/* <td>{item.estado}</td> */}
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
