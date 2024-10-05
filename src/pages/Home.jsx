import React from 'react'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from '../firebase/credenciales';
import NavTab from '../components/NavTab';
import { Card } from 'semantic-ui-react';


const Home = ({user}) => {


    const viewUser = () =>{
        console.log("user", user)
    }

  return (

    <NavTab  user={user}>


        <Card style={{margin:"20px", width:"auto", padding:"20px", fontFamily:"Poppins"}}>

          <div>
            <h1>Este es el HOME</h1>
              <button onClick={viewUser}>Mostrar Datos Usuario</button>
          </div>

        </Card>

    </NavTab>
  
  )
}

export default Home