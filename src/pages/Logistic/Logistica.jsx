import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebaseApp from "../../firebase/credenciales";
import NavTab from "../../components/NavTab";
import { Button, Card } from "semantic-ui-react";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

const Logistica = ({ user }) => {
  const [dataInventory, setDataInventory] = useState([]);

  const getDataInventory = async () => {
    try {
      const conectarData = query(collection(firestore, "EquipoInventory"));

      const snapData = await getDocs(conectarData);

      const docsMap = snapData.docs.map((doc) => {
        return doc.data();
      });

      setDataInventory(docsMap);

      console.log("Inventario: ", docsMap);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavTab user={user}>
      <Card
        style={{
          margin: "20px",
          width: "auto",
          padding: "20px",
          fontFamily: "Poppins",
        }}
      >
        <div>
          <h1> Inventarioasd Fogel </h1>

          <Button onClick={getDataInventory}>Conectar</Button>
        </div>
      </Card>
    </NavTab>
  );
};

export default Logistica;
