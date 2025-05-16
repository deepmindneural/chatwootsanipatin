import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useConversaciones } from '../contextos/ContextoConversaciones';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Registrar los componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function PaginaEstadisticas() {
  const { conversaciones, cargando } = useConversaciones();
  const [datosEstadisticas, setDatosEstadisticas] = useState({
    totalConversaciones: 0,
    conversacionesAbiertas: 0,
    conversacionesPendientes: 0,
    conversacionesResueltas: 0,
    mensajesEntrantes: 0,
    mensajesSalientes: 0,
    tiempoRespuestaPromedio: 0,
  });

  useEffect(() => {
    if (!cargando && conversaciones.length > 0) {
      analizarDatos();
    }
  }, [cargando, conversaciones]);

  const analizarDatos = () => {
    const conversacionesAbiertas = conversaciones.filter(c => c.estado === 'ABIERTA').length;
    const conversacionesPendientes = conversaciones.filter(c => c.estado === 'PENDIENTE').length;
    const conversacionesResueltas = conversaciones.filter(c => c.estado === 'RESUELTA').length;
    
    let mensajesEntrantes = 0;
    let mensajesSalientes = 0;
    let tiemposRespuesta = [];
    
    conversaciones.forEach(conv => {
      if (conv.mensajes && conv.mensajes.length > 0) {
        // Contar mensajes por dirección
        const entrantes = conv.mensajes.filter(m => m.direccion === 'ENTRANTE').length;
        const salientes = conv.mensajes.filter(m => m.direccion === 'SALIENTE').length;
        
        mensajesEntrantes += entrantes;
        mensajesSalientes += salientes;
        
        // Calcular tiempos de respuesta
        let ultimoMensajeEntrante = null;
        
        conv.mensajes.forEach(mensaje => {
          if (mensaje.direccion === 'ENTRANTE') {
            ultimoMensajeEntrante = new Date(mensaje.fechaEnvio);
          } else if (mensaje.direccion === 'SALIENTE' && ultimoMensajeEntrante) {
            const tiempoRespuesta = (new Date(mensaje.fechaEnvio) - ultimoMensajeEntrante) / (1000 * 60); // en minutos
            tiemposRespuesta.push(tiempoRespuesta);
            ultimoMensajeEntrante = null; // Reiniciar para la próxima secuencia
          }
        });
      }
    });
    
    // Calcular tiempo promedio de respuesta
    const tiempoRespuestaPromedio = tiemposRespuesta.length > 0
      ? tiemposRespuesta.reduce((a, b) => a + b, 0) / tiemposRespuesta.length
      : 0;
    
    setDatosEstadisticas({
      totalConversaciones: conversaciones.length,
      conversacionesAbiertas,
      conversacionesPendientes,
      conversacionesResueltas,
      mensajesEntrantes,
      mensajesSalientes,
      tiempoRespuestaPromedio: Math.round(tiempoRespuestaPromedio * 10) / 10, // Redondear a 1 decimal
    });
  };

  // Datos para el gráfico de barras
  const datosBarras = {
    labels: ['Abiertas', 'Pendientes', 'Resueltas'],
    datasets: [
      {
        label: 'Conversaciones por Estado',
        data: [
          datosEstadisticas.conversacionesAbiertas,
          datosEstadisticas.conversacionesPendientes,
          datosEstadisticas.conversacionesResueltas
        ],
        backgroundColor: [
          'rgba(102, 187, 106, 0.7)',
          'rgba(255, 167, 38, 0.7)',
          'rgba(66, 165, 245, 0.7)',
        ],
        borderColor: [
          'rgb(102, 187, 106)',
          'rgb(255, 167, 38)',
          'rgb(66, 165, 245)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico circular
  const datosPie = {
    labels: ['Entrantes', 'Salientes'],
    datasets: [
      {
        label: 'Mensajes',
        data: [datosEstadisticas.mensajesEntrantes, datosEstadisticas.mensajesSalientes],
        backgroundColor: [
          'rgba(66, 165, 245, 0.7)',
          'rgba(102, 187, 106, 0.7)',
        ],
        borderColor: [
          'rgb(66, 165, 245)',
          'rgb(102, 187, 106)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de línea (actividad semanal)
  const datosLinea = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Mensajes Recibidos',
        data: [12, 19, 15, 17, 20, 8, 5], // Valores de ejemplo
        borderColor: 'rgb(66, 165, 245)',
        backgroundColor: 'rgba(66, 165, 245, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Mensajes Enviados',
        data: [8, 15, 12, 14, 18, 7, 4], // Valores de ejemplo
        borderColor: 'rgb(102, 187, 106)',
        backgroundColor: 'rgba(102, 187, 106, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Opciones comunes para los gráficos
  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <>
      <Head>
        <title>Estadísticas - Chatwoot Sanipatin</title>
        <meta name="description" content="Estadísticas de la integración de Chatwoot con WhatsApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gris-900">Panel de Estadísticas</h1>
        
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
          </div>
        ) : (
          <>
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="tarjeta bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gris-500 mb-1">Total Conversaciones</h3>
                <p className="text-2xl font-bold text-gris-900">{datosEstadisticas.totalConversaciones}</p>
              </div>
              
              <div className="tarjeta bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gris-500 mb-1">Conversaciones Abiertas</h3>
                <p className="text-2xl font-bold text-estado-activo">{datosEstadisticas.conversacionesAbiertas}</p>
              </div>
              
              <div className="tarjeta bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gris-500 mb-1">Total Mensajes</h3>
                <p className="text-2xl font-bold text-gris-900">{datosEstadisticas.mensajesEntrantes + datosEstadisticas.mensajesSalientes}</p>
              </div>
              
              <div className="tarjeta bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gris-500 mb-1">Tiempo Respuesta Promedio</h3>
                <p className="text-2xl font-bold text-primario">{datosEstadisticas.tiempoRespuestaPromedio} min</p>
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="tarjeta p-4">
                <h3 className="text-lg font-bold text-gris-900 mb-4">Estado de Conversaciones</h3>
                <Bar data={datosBarras} options={opcionesGrafico} />
              </div>
              
              <div className="tarjeta p-4">
                <h3 className="text-lg font-bold text-gris-900 mb-4">Distribución de Mensajes</h3>
                <div className="h-64">
                  <Pie data={datosPie} options={opcionesGrafico} />
                </div>
              </div>
            </div>
            
            <div className="tarjeta p-4 mb-6">
              <h3 className="text-lg font-bold text-gris-900 mb-4">Actividad Semanal</h3>
              <Line data={datosLinea} options={opcionesGrafico} />
            </div>
            
            {/* Recomendaciones */}
            <div className="tarjeta p-4">
              <h3 className="text-lg font-bold text-gris-900 mb-4">Recomendaciones</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <h4 className="font-medium text-blue-800">Optimizar tiempo de respuesta</h4>
                  <p className="text-sm text-gris-600 mt-1">
                    Configura respuestas rápidas en Chatwoot para los mensajes más frecuentes y reduce el tiempo de respuesta.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h4 className="font-medium text-yellow-800">Pendientes de resolución</h4>
                  <p className="text-sm text-gris-600 mt-1">
                    Hay {datosEstadisticas.conversacionesPendientes} conversaciones en estado pendiente. Asigna estas conversaciones a agentes disponibles.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                  <h4 className="font-medium text-green-800">Implementar chatbot</h4>
                  <p className="text-sm text-gris-600 mt-1">
                    Considera implementar un chatbot para respuestas automáticas a preguntas frecuentes y mejorar el tiempo de primera respuesta.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
