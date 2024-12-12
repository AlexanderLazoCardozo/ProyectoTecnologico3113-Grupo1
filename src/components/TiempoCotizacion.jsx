import React, { useEffect } from "react";
import firebaseApp from "../../src/firebase/credenciales";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

const VencimientoCotizaciones = () => {
  useEffect(() => {
    const checkVencimiento = async () => {
      const cotizacionesRef = collection(db, "DataCotizaciones");
      const querySnapshot = await getDocs(cotizacionesRef);

      querySnapshot.forEach(async (docSnapshot) => {
        const cotizacion = docSnapshot.data();
        const fechaVencimiento = cotizacion.FechaVencimiento;

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        const fechaVencimientoDate = new Date(
          fechaVencimiento.split("/").reverse().join("-")
        );
        fechaVencimientoDate.setHours(0, 0, 0, 0);

        const estadoCotizacion = cotizacion.Status;

        if (
          (estadoCotizacion === "En espera" ||
            estadoCotizacion === "Facturado") &&
          fechaVencimientoDate < fechaActual &&
          cotizacion.Status !== "Vencida"
        ) {
          const cotizacionRef = doc(db, "DataCotizaciones", docSnapshot.id);
          await updateDoc(cotizacionRef, {
            Status: "Vencida",
          });

          console.log(
            `Cotización ${cotizacion.CodigoCli} actualizada a vencida.`
          );

          for (const equipo of cotizacion.Equipos) {
            if (!equipo.stockDevuelto) {
              await devolverStock(equipo.codigoEquipo, equipo.cantidad);

              await updateDoc(cotizacionRef, {
                stockDevuelto: true,
              });
            }
          }
        }
      });
    };

    checkVencimiento();
  }, []);

  // Función para  el stock  en el inventario
  const devolverStock = async (codigoEquipo, cantidad) => {
    const inventarioRef = collection(db, "EquipoInventory");
    const querySnapshot = await getDocs(inventarioRef);

    let equipoEncontrado = false;

    querySnapshot.forEach(async (docSnapshot) => {
      const equipo = docSnapshot.data();

      if (equipo.CodigoEquipo === codigoEquipo) {
        const nuevoStock = equipo.Stock + cantidad;

        const equipoRef = doc(db, "EquipoInventory", docSnapshot.id);
        await updateDoc(equipoRef, {
          Stock: nuevoStock,
        });

        console.log(
          `Stock del equipo ${codigoEquipo} actualizado. Nuevo stock: ${nuevoStock}`
        );
        equipoEncontrado = true;
      }
    });

    if (!equipoEncontrado) {
      console.log(
        `El equipo con código ${codigoEquipo} no se encontró en el inventario.`
      );
    }
  };

  return <div></div>;
};

export default VencimientoCotizaciones;
