import React,{useState} from 'react'
import firebaseApp from '../firebase/credenciales';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(firebaseApp);


const Login = ({isLoading}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setError('Credenciales inválidas');
      } 
    };


  return (
    <div>
      
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
      {error && <p>{error}</p>}
    </form>
  </div>
  )
}

export default Login