import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './components/App.css';

const Reportes = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await axios.get('/api/funcionarios');
                setFuncionarios(response.data);
            } catch (error) {
                console.error("Error al obtener los funcionarios:", error);
                setError('Error al obtener los funcionarios.');
            }
        };
        fetchFuncionarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar mensaje de error
        setSuccessMessage(''); // Limpiar mensaje de éxito

        // Limpiar los reportes anteriores
        setReportes([]);

        if (!selectedFuncionario || !fechaDesde || !fechaHasta) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Convertir las fechas a objetos Date
        const desde = new Date(fechaDesde);
        const hasta = new Date(fechaHasta);

        // Asegúrate de que las fechas no se inviertan
        if (desde > hasta) {
            setError('La fecha "desde" debe ser anterior a la fecha "hasta".');
            return;
        }

        // Ajustar las fechas para la consulta
        const fechaDesdeISO = new Date(desde.setHours(0, 0, 0, 0)).toISOString(); // Iniciar el día
        const fechaHastaISO = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate(), 23, 59, 59, 999).toISOString(); // Terminar el día

        console.log("Fecha desde:", fechaDesdeISO); // Para depuración
        console.log("Fecha hasta:", fechaHastaISO); // Para depuración

        try {
            const response = await axios.get(`/api/reportes/${selectedFuncionario}`, {
                params: {
                    desde: fechaDesdeISO,
                    hasta: fechaHastaISO
                }
            });
            setReportes(response.data);
            setSuccessMessage('Reporte generado exitosamente.'); // Establecer mensaje de éxito
        } catch (error) {
            console.error("Error obteniendo reportes:", error);
            // Captura el mensaje de error del backend
            if (error.response && error.response.data) {
                setError(error.response.data); // Mostrar el mensaje de error proporcionado por el backend
            } else {
                setError('Error al obtener los reportes.'); // Mensaje genérico en caso de error inesperado
            }
        }
    };

    const calcularHorasTrabajadas = (horaEntrada, horaSalida) => {
        const entrada = new Date(`1970-01-01T${horaEntrada}Z`);
        const salida = new Date(`1970-01-01T${horaSalida}Z`);
        const diff = (salida - entrada) / 1000 / 3600; // Diferencia en horas
        return diff > 0 ? diff.toFixed(2) : 0; // Retornar horas trabajadas
    };

    const handleFuncionarioChange = (e) => {
        setSelectedFuncionario(e.target.value);
        setError(''); // Limpiar mensaje de error al seleccionar un funcionario
        setSuccessMessage(''); // Limpiar mensaje de éxito al seleccionar un funcionario
        setReportes([]); // Limpiar reportes al seleccionar un funcionario
    };

    return (
        <div className="container"> {/* Agrega la clase container aquí */}
            <h2>Reportes de Entrada y Salida</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mensaje de error */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Mensaje de éxito */}
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
                    value={fechaDesde}
                    onChange={e => setFechaDesde(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={fechaHasta}
                    onChange={e => setFechaHasta(e.target.value)}
                    required
                />
                <button type="submit">Generar Reporte</button>
            </form>

            {reportes.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>Hora Entrada</th>
                        <th>Hora Salida</th>
                        <th>Cantidad de Horas Trabajadas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportes.map((registro) => (
                        <tr key={registro._id}> {/* Cambié 'id' por '_id' para reflejar la estructura de MongoDB */}
                            <td>{registro.horaEntrada}</td>
                            <td>{registro.horaSalida}</td>
                            <td>{calcularHorasTrabajadas(registro.horaEntrada, registro.horaSalida)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Reportes;
