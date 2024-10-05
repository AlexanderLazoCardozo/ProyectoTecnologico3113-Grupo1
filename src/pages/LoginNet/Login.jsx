import React,{useState, useEffect} from 'react'
import firebaseApp from '../../firebase/credenciales';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import fondo from './../../assets/fondo.jpg';
import logo from './../../assets/logo.png';
import { Button, Form, Grid, Header, Segment, Image, Container } from 'semantic-ui-react';

const auth = getAuth(firebaseApp);


const Login = ({isLoading}) => {

    useEffect(() => {
      document.body.style.backgroundImage = `url(${fondo})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = 'center';

      return () => {
        document.body.style.backgroundImage = '';
      };
    }, []);


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
    <Container >
      <Grid style={{ height: '100vh' }} >
        <Grid.Row  centered style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column width={16} mobile={20} tablet={8} computer={5} style={{ paddingLeft: '15px', paddingRight: '15px' }}>
            

            <Form onSubmit={handleLogin}>
              <Segment raised style={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <Header as='h2' textAlign='center' style={{ marginBottom: '20px', marginTop: '10px', color: '#4A4A4A' }}>
               
                </Header>
                <Image src={logo} alt="Logo de Foguel" size='medium' centered style={{ marginBottom: '20px' }} />
                <h4 style={{ marginBottom: '20px', fontWeight: 'normal', textAlign: 'center', color: '#4A4A4A' }}>Ingrese sus credenciales</h4>

                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Usuario'
                  id='usu'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Contraseña'
                  type='password'
                  id='contra'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button disabled={isLoading} color='yellow' fluid size='large' style={{ marginTop: '20px' }}>
                  {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>
                {error && <p>{error}</p>}

              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default Login