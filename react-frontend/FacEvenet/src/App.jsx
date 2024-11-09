import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { Register_2 } from './pages/register/Register_2';
import { Register_3 } from './pages/register/Register_3';
import { Register_4 } from './pages/register/Register_4';
import { Navigate } from "react-router-dom";
import { Home } from './pages/home/Home';
import { Clubs } from './pages/clubs/Clubs';
import { Evenements } from './pages/evenements/Evenements';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import Layout from './components/Layout';
import { Dashboard_admin } from './pages/dashboard-Admin/Dashboard-admin';

import { Clubs_admin } from './pages/dashboard-Admin/Clubs_admin';
import { Evenements_admin } from './pages/dashboard-Admin/Evenements_admin';
import { Dashboard_president } from './pages/dashboard-president/Dashboard_president';
import { QuestionsManager } from './pages/dashboard-president/QuestionsManager';
import { Evenements_president } from './pages/dashboard-president/Evenements_president';
import Layout_president from './components/Layout_president';
import { Evenement } from './pages/evenement/evenement';

function App(){
  return(
    <PrimeReactProvider theme="lara-light-cyan" >
      <Router> 
        <Routes>
          <Route path="/" element={<Navigate to="/home" />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/registerinformation" element={<Register_2/>}/>
          <Route path="/verification" element={<Register_3/>}/>
          <Route path="/verificationcode" element={<Register_4/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/clubs" element={<Clubs/>}/>
          <Route path="/evenements" element={<Evenements/>}/>
          <Route path="/evenement/:id" element={<Evenement/>}/>
          <Route path="/admin" element={<Layout/>}>
            <Route index element={<Dashboard_admin/>}/>
    
            <Route path="clubs_admin" element={<Clubs_admin/>}/>
            <Route path="evenements_admin" element={<Evenements_admin/>}/>
          </Route>
          <Route path="/president" element={<Layout_president/>}>
          <Route index element={<Dashboard_president/>}/>
    
            <Route path="clubs_president" element={<QuestionsManager/>}/>
             <Route path="evenements_president" element={<Evenements_president/>}/>
          </Route>
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
