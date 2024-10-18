import { Button } from "semantic-ui-react";

const CotizacionesTabla = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Codigo de Producto</th>
          {/* <th>Nombre del Producto</th> */}
          <th>Descripcion del Producto</th>
          <th>Cantidad Disponible</th>
          <th>Precio Unitario</th>
          
          {/* Este termino era segun la cantidad solicitada, no un valor
          de por si.
          <th>Valor Total</th> 
          */}
          {/* Este campo seria para documentos singulares
          no para uno que representa a varios productos
          <th>Fecha de Ingreso</th> 
          */}
          {/* <th>Estado</th> */}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.CodigoEquipo}</td>
            {/* <td>{item.nombreProducto}</td> */}
            <td>{item.Descripcion}</td>
            <td>{item.Stock}</td>
            <td>{item.Precio}</td>
            {/* <td>{item.valorTotal}</td> */}
            {/* <td>{item.fechaIngreso}</td> */}
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
