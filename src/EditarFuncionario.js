import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './components/App.css';

const EditarFuncionario = () => {
    const [funcionario, setFuncionario] = useState(null);
    const [id, setId] = useState('');
    const [funcionarios, setFuncionarios] = useState([]); // Estado para los funcionarios

    // Función para obtener todos los funcionarios
    const fetchFuncionarios = async () => {
        try {
            const response = await axios.get('/api/funcionarios');
            setFuncionarios(response.data);
        } catch (error) {
            console.error("Error al obtener los funcionarios:", error);
        }
    };

    // Obtener funcionarios al cargar el componente
    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionario = async () => {
        if (id) {
            try {
                const response = await axios.get(`/api/funcionarios/${id}`);
                setFuncionario(response.data);
            } catch (error) {
                console.error("Error al obtener el funcionario:", error);
                setFuncionario(null); // Resetear funcionario si hay error
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFuncionario(); // Llama a la función para buscar el funcionario
    };

    const handleIdChange = (e) => {
        setId(e.target.value); // Actualiza el ID
        setFuncionario(null); // Resetea los datos del funcionario al seleccionar un nuevo ID
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/funcionarios/${id}`, funcionario);
            // Manejar la redirección o mostrar un mensaje de éxito
            alert('Funcionario actualizado exitosamente.'); // Ejemplo de mensaje de éxito
        } catch (error) {
            console.error("Error al actualizar el funcionario:", error);
        }
    };

    return (
        <div className="container">
            <h2>Editar Funcionario</h2>
            <form onSubmit={handleSearch}>
                <select value={id} onChange={handleIdChange} required>
                    <option value="">Seleccionar Funcionario</option>
                    {funcionarios.map(funcionario => (
                        <option key={funcionario.id} value={funcionario.id}>
                            {funcionario.nombres} {funcionario.apellidos} (ID: {funcionario.id})
                        </option>
                    ))}
                </select>
                <button type="submit">Buscar Funcionario</button>
            </form>

            {funcionario && (
                <form onSubmit={handleSubmit}>
                    <input
                        value={funcionario.nombres}
                        onChange={(e) => setFuncionario({ ...funcionario, nombres: e.target.value })}
                        placeholder="Nombres"
                    />
                    <input
                        value={funcionario.apellidos}
                        onChange={(e) => setFuncionario({ ...funcionario, apellidos: e.target.value })}
                        placeholder="Apellidos"
                    />
                    <input
                        value={funcionario.cedula}
                        onChange={(e) => setFuncionario({ ...funcionario, cedula: e.target.value })}
                        placeholder="Cédula"
                    />
                    <input
                        value={funcionario.fechaNacimiento?.substring(0, 10) || ''} // Cargar la fecha correctamente
                        onChange={(e) => setFuncionario({ ...funcionario, fechaNacimiento: e.target.value })}
                        type="date"
                    />
                    <button type="submit">Actualizar</button>
                </form>
            )}
        </div>
    );
};

export default EditarFuncionario;
