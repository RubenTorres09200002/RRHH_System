import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components/App.css';

axios.defaults.baseURL = 'http://localhost:5187';

const RegistrarEntradaSalida = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const response = await axios.get('/api/funcionarios');
            setFuncionarios(response.data);
        } catch (error) {
            console.error("Error fetching funcionarios:", error);
            setError('Error al obtener los funcionarios.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        setSuccessMessage(''); // Reset success message

        if (!selectedFuncionario || !fecha || !horaEntrada || !horaSalida) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Agregar segundos a las horas
        const nuevoRegistro = {
            funcionarioId: selectedFuncionario,
            fecha,
            horaEntrada: `${horaEntrada}:00`, // Añadir segundos
            horaSalida: `${horaSalida}:00` // Añadir segundos
        };

        try {
            await axios.post('/api/registros', nuevoRegistro);
            // Limpiar los campos después del registro
            setSelectedFuncionario('');
            setFecha('');
            setHoraEntrada('');
            setHoraSalida('');
            // Establecer mensaje de éxito
            setSuccessMessage('Registro de entrada y salida registrado exitosamente.');
        } catch (error) {
            console.error("Error registrando entrada/salida:", error);
            // Capturar el mensaje de error del controlador
            if (error.response && error.response.data) {
                setError(error.response.data); // Mostrar el mensaje específico del error
            } else {
                setError('Error al registrar la entrada/salida.'); // Mensaje genérico si no se recibe respuesta
            }
        }
    };

    const handleFuncionarioChange = (e) => {
        setSelectedFuncionario(e.target.value);
        setError(''); // Limpiar mensaje de error al seleccionar un funcionario
        setSuccessMessage(''); // Limpiar mensaje de éxito al seleccionar un funcionario
    };

    return (
        <div className="container"> {/* Agrega la clase container aquí */}
            <h1>Registrar Entrada y Salida</h1>
            {error && <p className="error">{error}</p>} {/* Aplica la clase error */}
            {successMessage && <p className="success">{successMessage}</p>} {/* Aplica la clase success */}
            <form onSubmit={handleSubmit}>
                <select value={selectedFuncionario} onChange={handleFuncionarioChange} required>
                    <option value="">Seleccionar Funcionario</option>
                    {funcionarios.map(funcionario => (
                        <option key={funcionario.id} value={funcionario.id}>
                            {funcionario.nombres} {funcionario.apellidos}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={horaEntrada}
                    onChange={e => setHoraEntrada(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={horaSalida}
                    onChange={e => setHoraSalida(e.target.value)}
                    required
                />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegistrarEntradaSalida;
