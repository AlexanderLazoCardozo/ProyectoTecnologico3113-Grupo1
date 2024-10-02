import React from 'react'
import {getDocs, addDoc, collection, writeBatch ,getFirestore, query,setDoc, doc, updateDoc, arrayUnion, getDoc, where} from 'firebase/firestore';
import firebaseApp from "../firebase/credenciales"

const firestore = getFirestore(firebaseApp)

const ConexionBD = () => {

    const dataCall = async () =>{

        try {

            const conectarBase = query(collection(firestore,"TablaClientes"))

            const conectarSnapshot = await getDocs(conectarBase)


            const documentosFind = conectarSnapshot.docs.map((doc) => {

                return doc.data()

            })

            console.log("documentosFind",documentosFind)

            
        } catch (error) {
            console.log(error)
        }

    }


  return (
    <div>
        
        <button onClick={dataCall}>Conectar</button>
    </div>
  )
}

export default ConexionBD