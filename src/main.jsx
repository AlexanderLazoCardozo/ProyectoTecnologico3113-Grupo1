import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

import {createRoot} from "react-dom/client"
import AppWrapper from './App'


const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<AppWrapper tab="home" />);

