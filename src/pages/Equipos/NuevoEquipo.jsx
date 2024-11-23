import {
  addDoc,
  collection,
  doc,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  Button,
  Form,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
} from "semantic-ui-react";
import firebaseApp from "../../firebase/credenciales";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firestore = getFirestore(firebaseApp);

const NuevoEquipo = () => {
  const [open, setOpen] = React.useState(false);

  const [productForm, setProductForm] = useState({
    codigoProducto: "",
    numSerie: "",
    status: "",
  });

  const handleChange = (e, data) => {
    setProductForm({
      ...productForm,
      [data.id]: data.value,
    });
  };

  const crearProducto = async () => {
    try {
      setOpen(false);

      const ref = collection(firestore, "EquipoAlmacen");

      const fechaActual = new Date();
      const fechaFormatoEsp = fechaActual.toLocaleDateString("es-ES");

      await addDoc(ref, { ...productForm, fechaCreacion: fechaFormatoEsp });

      toast.success("Equipo agregado exitosamente.");
      setProductForm({
        codigoProducto: "",
        numSerie: "",
        status: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button primary>Añadir Producto</Button>}
    >
      <ModalHeader>Añadir Producto</ModalHeader>
      <ModalContent>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Codigo del Equipo al que pertenece"
              placeholder="Codigo de Equipo"
              id="codigoProducto"
              onChange={handleChange}
              value={productForm.codigoProducto}
              options={[
                {
                  key: "codigo",
                  text: "- Selecciona Codigo -",
                  value: "Sin Datos",
                },
                { key: "VE-28-V1", text: "VE-28-V1", value: "VE-28-V1" },
                { key: "CR-23-A-V1", text: "CR-23-A-V1", value: "CR-23-A-V1" },
                {
                  key: "MTR-48-FP-V1",
                  text: "MTR-48-FP-V1",
                  value: "MTR-48-FP-V1",
                },
                {
                  key: "CR-23-A-SSA-V1",
                  text: "CR-23-A-SSA-V1",
                  value: "CR-23-A-SSA-V1",
                },
                {
                  key: "FROSTER-280-PVP-V1",
                  text: "FROSTER-280-PVP-V1",
                  value: "FROSTER-280-PVP-V1",
                },
              ]}
            />
            <Form.Input
              fluid
              label="Numero de Serie"
              placeholder="Numero de Serie"
              id="numSerie"
              onChange={handleChange}
              value={productForm.numSerie}
            />

            <Form.Select
              fluid
              label="Status"
              options={[
                {
                  key: "stat",
                  text: "- Selecciona Status -",
                  value: "Sin Datos",
                },
                { key: "EnAlmacen", text: "En Almacen", value: "En Almacen" },
                { key: "Despachado", text: "Despachado", value: "Despachado" },
              ]}
              placeholder="Status"
              id="status"
              onChange={handleChange}
              value={productForm.status}
            />
            <Button positive onClick={crearProducto}>
              Agregar
            </Button>
          </Form.Group>
        </Form>
      </ModalContent>
      <ModalActions>
        <Button
          content="Cerrar"
          labelPosition="right"
          icon="x"
          onClick={() => setOpen(false)}
          color="red"
        />
      </ModalActions>
    </Modal>
  );
};

export default NuevoEquipo;
