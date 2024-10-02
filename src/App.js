import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegistrarFuncionario from './RegistrarFuncionario';
import VerFuncionarios from './VerFuncionarios';
import EditarFuncionario from './EditarFuncionario';
import RegistrarEntradaSalida from './RegistrarEntradaSalida';
import Reportes from './Reportes';
import './components/App.css';

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/registrarFuncionariosNuevos">Registrar Funcionario</Link></li>
                    <li><Link to="/verFuncionarios">Ver Funcionarios</Link></li>
                    <li><Link to="/editarFuncionariosExistentes">Editar Funcionarios</Link></li>
                    <li><Link to="/registroEntradaYSalida">Registrar Entrada/Salida</Link></li>
                    <li><Link to="/obtenerReportes">Obtener Reportes</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/registrarFuncionariosNuevos" element={<RegistrarFuncionario />} />
                <Route path="/verFuncionarios" element={<VerFuncionarios />} />
                <Route path="/editarFuncionariosExistentes" element={<EditarFuncionario />} />
                <Route path="/registroEntradaYSalida" element={<RegistrarEntradaSalida />} />
                <Route path="/obtenerReportes" element={<Reportes />} />
            </Routes>
        </Router>
    );
};

export default App;
