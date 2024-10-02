import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components/App.css';

const RegistrarFuncionario = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [cedula, setCedula] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const response = await axios.get('api/funcionarios');
            setFuncionarios(response.data);
        } catch (error) {
            console.error("Error fetching funcionarios:", error);
            setError('Error al obtener los funcionarios.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            await axios.post('api/funcionarios', { nombres, apellidos, cedula, fechaNacimiento });
            setSuccessMessage('Funcionario registrado exitosamente.'); // Mensaje de éxito
            fetchFuncionarios(); 
            setNombres(''); 
            setApellidos('');
            setCedula('');
            setFechaNacimiento('');
        } catch (error) {
            console.error("Error submitting funcionario:", error);
            setError(error.response?.data?.message || 'Error al registrar el funcionario. Verifica la información.'); // Mostrar mensaje de error del backend
        }
    };

    return (
        <div className="container"> {/* Añadir la clase container */}
            <h1>Registrar Funcionario</h1>
            {error && <p className="error">{error}</p>} {/* Usar la clase error */}
            {successMessage && <p className="success">{successMessage}</p>} {/* Mensaje de éxito */}
            <form onSubmit={handleSubmit}>
                <input
                    value={nombres}
                    onChange={e => setNombres(e.target.value)}
                    placeholder="Nombres"
                    required
                />
                <input
                    value={apellidos}
                    onChange={e => setApellidos(e.target.value)}
                    placeholder="Apellidos"
                    required
                />
                <input
                    value={cedula}
                    onChange={e => setCedula(e.target.value)}
                    placeholder="Cédula"
                    required
                />
                <input
                    value={fechaNacimiento}
                    onChange={e => setFechaNacimiento(e.target.value)}
                    type="date"
                    required
                />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegistrarFuncionario;
