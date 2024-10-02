import React from 'react'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from '../firebase/credenciales';
import NavTab from '../components/NavTab';


const Home = ({user}) => {


    const viewUser = () =>{
        console.log("user", user)
    }

  return (

    <NavTab>

        <div>Este es el HOME
            <button onClick={viewUser}>Mostrar</button>
        </div>


    </NavTab>
  
  )
}

export default Home