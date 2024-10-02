import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './components/App.css';

const VerFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await axios.get('/api/funcionarios');
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Error al obtener los funcionarios:", error);
            }
        };
        fetchFuncionarios();
    }, []);

    const formatFechaNacimiento = (fecha) => {
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, '0'); // Obtener el día y agregar ceros a la izquierda
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes y agregar ceros a la izquierda
        const anio = date.getFullYear(); // Obtener el año

        return `${dia}/${mes}/${anio}`; // Formato DD/MM/YYYY
    };

    return (
        <div>
            <h2>Lista de Funcionarios</h2>
            <table>
                <thead>
                <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Cédula</th>
                    <th>Fecha de Nacimiento</th>
                </tr>
                </thead>
                <tbody>
                {funcionarios.map(funcionario => (
                    <tr key={funcionario.id}>
                        <td>{funcionario.nombres}</td>
                        <td>{funcionario.apellidos}</td>
                        <td>{funcionario.cedula}</td>
                        <td>{formatFechaNacimiento(funcionario.fechaNacimiento)}</td> {/* Llamada a la función para formatear la fecha */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerFuncionarios;
