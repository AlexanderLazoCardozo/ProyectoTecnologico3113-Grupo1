import { Button } from "semantic-ui-react";

const CotizacionesTabla = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Codigo de Producto</th>
          <th>Nombre del Producto</th>
          <th>Descripcion del Producto</th>
          <th>Cantidad Disponible</th>
          <th>Precio Unitario</th>
          <th>Valor Total</th>
          <th>Fecha de Ingreso</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.codigo}</td>
            <td>{item.nombreProducto}</td>
            <td>{item.descripcion}</td>
            <td>{item.cantidadDisponible}</td>
            <td>{item.precioUnitario}</td>
            <td>{item.valorTotal}</td>
            <td>{item.fechaIngreso}</td>
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
