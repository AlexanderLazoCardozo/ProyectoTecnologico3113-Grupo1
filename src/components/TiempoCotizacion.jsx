import { useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
  getFirestore,
} from "firebase/firestore";
import firebaseApp from "../../src/firebase/credenciales";

const db = getFirestore(firebaseApp);

const verificarVencimientoCotizaciones = async () => {
  try {
    const cotizacionesRef = collection(db, "DataCotizaciones");
    const snapshot = await getDocs(cotizacionesRef);
    const hoy = new Date();

    snapshot.forEach(async (docSnap) => {
      const cotizacion = docSnap.data();

      if (cotizacion.Status === "Facturado" || cotizacion.VencidaVerificada) {
        console.log(`Cotización ${docSnap.id} ya ha sido procesada.`);
        return;
      }

      const fechaVencimiento = new Date(
        cotizacion.FechaVencimiento.split("/").reverse().join("-")
      );

      if (hoy >= fechaVencimiento) {
        const cotizacionDocRef = doc(db, "DataCotizaciones", docSnap.id);

        await updateDoc(cotizacionDocRef, {
          Status: "Vencida",
        });
        console.log(`Cotización ${docSnap.id} actualizada a vencida.`);

        //  Falta implementar esto sale error `
        if (cotizacion.Equipos && Array.isArray(cotizacion.Equipos)) {
          cotizacion.Equipos.forEach(async (equipo) => {
            const codigoEquipo = equipo.codigoEquipo;
            const cantidad = equipo.cantidad;
            if (codigoEquipo && cantidad !== undefined) {
              const equipoRef = doc(db, "EquipoInventory", codigoEquipo);

              await updateDoc(equipoRef, {
                Stock: increment(cantidad),
              });

              console.log(
                `Stock devuelto: ${cantidad} unidades de ${codigoEquipo}.`
              );
            } else {
              console.log(
                `Datos incompletos para el equipo con código ${equipo.codigoEquipo}`
              );
            }
          });
        }
      }
    });

    console.log("Verificación completada.");
  } catch (error) {
    console.error("Error al verificar:", error);
  }
};

const VencimientoCotizaciones = () => {
  useEffect(() => {
    verificarVencimientoCotizaciones();

    const interval = setInterval(
      () => {
        verificarVencimientoCotizaciones();
      },
      24 * 60 * 60 * 1000 // 24 horas
    );

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default VencimientoCotizaciones;
