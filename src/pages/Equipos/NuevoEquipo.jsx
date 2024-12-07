import {
  addDoc,
  collection,
  query,
  updateDoc,
  where,
  getDocs,
  doc,
  getFirestore,
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
  });

  const handleChange = (e, data) => {
    setProductForm({
      ...productForm,
      [data.id]: data.value,
    });
  };

  const crearProducto = async () => {
    if (!productForm.codigoProducto || !productForm.numSerie) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    toast.info("Procesando equipo...");

    try {
      setOpen(false);

      const ref = collection(firestore, "EquipoAlmacen");

      const fechaActual = new Date();
      const fechaFormatoEsp = fechaActual.toLocaleDateString("es-ES");

      await addDoc(ref, {
        ...productForm,
        status: "En Almacen",
        fechaCreacion: fechaFormatoEsp,
      });

      setProductForm({
        codigoProducto: "",
        numSerie: "",
      });

      const refInventory = query(
        collection(firestore, "EquipoInventory"),
        where("CodigoEquipo", "==", productForm.codigoProducto)
      );

      const querySnapshot = await getDocs(refInventory);

      let dataEquipo = [];

      querySnapshot.forEach((doc) => {
        dataEquipo = [doc.id, doc.data().Stock];
      });

      if (dataEquipo.length > 0) {
        await updateDoc(doc(firestore, "EquipoInventory", dataEquipo[0]), {
          Stock: dataEquipo[1] + 1,
        });
      }

      toast.success("Equipo agregado exitosamente.");
    } catch (error) {
      console.log(error);
      toast.error("Hubo un error al agregar el equipo.");
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
                  value: "",
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
          </Form.Group>
          <Button positive onClick={crearProducto}>
            Agregar
          </Button>
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
