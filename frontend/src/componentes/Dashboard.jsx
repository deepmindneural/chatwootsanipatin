import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  ArcElement 
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  ArcElement
);

const Dashboard = ({ datos = {} }) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('7d');
  const [estadisticas, setEstadisticas] = useState({
    conversacionesNuevas: 0,
    mensajesRecibidos: 0,
    tiempoRespuestaPromedio: 0,
    tasaResolucion: 0,
    calidadServicio: 0
  });

  useEffect(() => {
    // En una implementación real, aquí se cargarían los datos según el periodo
    actualizarEstadisticas();
  }, [periodoSeleccionado]);

  const actualizarEstadisticas = () => {
    // Simulación de datos según el periodo seleccionado
    const factorMultiplicador = periodoSeleccionado === '30d' ? 4 : 
                               periodoSeleccionado === '14d' ? 2 : 1;
    
    setEstadisticas({
      conversacionesNuevas: 28 * factorMultiplicador,
      mensajesRecibidos: 156 * factorMultiplicador,
      tiempoRespuestaPromedio: 4.2,
      tasaResolucion: 87,
      calidadServicio: 92
    });
  };

  // Datos para gráfico de línea - Conversaciones por día
  const datosConversaciones = {
    labels: ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May', '8 May', '9 May', '10 May'],
    datasets: [
      {
        label: 'Conversaciones',
        data: [12, 19, 13, 15, 20, 18, 15, 22, 25, 23],
        borderColor: '#00B2B2',
        backgroundColor: 'rgba(0, 178, 178, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Datos para gráfico de barras - Mensajes por canal
  const datosMensajesPorCanal = {
    labels: ['WhatsApp', 'Facebook', 'Instagram', 'Web', 'Email'],
    datasets: [
      {
        label: 'Mensajes Recibidos',
        data: [156, 84, 62, 45, 32],
        backgroundColor: [
          'rgba(0, 178, 178, 0.8)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(3, 169, 244, 0.8)',
          'rgba(255, 87, 34, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para gráfico de dona - Estado de conversaciones
  const datosEstadoConversaciones = {
    labels: ['Abiertas', 'Pendientes', 'Resueltas'],
    datasets: [
      {
        data: [25, 15, 60],
        backgroundColor: [
          'rgba(255, 167, 38, 0.8)',
          'rgba(3, 169, 244, 0.8)',
          'rgba(76, 175, 80, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const calcularTendencia = (actual, anterior) => {
    const diferencia = actual - anterior;
    return (
      <div className={`flex items-center ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {diferencia >= 0 ? (
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        <span>{Math.abs(diferencia)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabecera - Selector de periodo y exportación */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl font-bold text-gris-900 hidden sm:block">Panel de Control</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button 
              className="flex items-center text-sm font-medium text-gris-700 px-3 py-1.5 rounded-md border border-gris-300 hover:bg-gris-50"
              onClick={() => document.getElementById('menuExportar')?.classList.toggle('hidden')}
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar
            </button>
            
            <div id="menuExportar" className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button className="block w-full text-left px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" role="menuitem">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gris-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </div>
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" role="menuitem">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gris-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Excel
                  </div>
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" role="menuitem">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gris-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                    </svg>
                    CSV
                  </div>
                </button>
              </div>
            </div>
          </div>
        
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setPeriodoSeleccionado('7d')}
              className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${periodoSeleccionado === '7d'
                ? 'bg-primario text-white border-primario'
                : 'bg-white text-gris-700 border-gris-300 hover:bg-gris-50'
              }`}
            >
              7 días
            </button>
            <button
              type="button"
              onClick={() => setPeriodoSeleccionado('14d')}
              className={`px-3 py-1.5 text-sm font-medium border-t border-b ${periodoSeleccionado === '14d'
                ? 'bg-primario text-white border-primario'
                : 'bg-white text-gris-700 border-gris-300 hover:bg-gris-50'
              }`}
            >
              14 días
            </button>
            <button
              type="button"
              onClick={() => setPeriodoSeleccionado('30d')}
              className={`px-3 py-1.5 text-sm font-medium rounded-r-md border ${periodoSeleccionado === '30d'
                ? 'bg-primario text-white border-primario'
                : 'bg-white text-gris-700 border-gris-300 hover:bg-gris-50'
              }`}
            >
              30 días
            </button>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de métricas mejoradas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="tarjeta p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gris-500">Conversaciones nuevas</p>
              <p className="text-2xl font-semibold text-gris-900 mt-1">{estadisticas.conversacionesNuevas}</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-primario bg-opacity-10 flex items-center justify-center">
              <svg className="h-6 w-6 text-primario" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {calcularTendencia(estadisticas.conversacionesNuevas, 23)}
            <div className="text-xs font-medium text-gris-500">
              <span className="text-gris-900">{Math.round(estadisticas.conversacionesNuevas/periodoSeleccionado.replace('d',''))}</span> diarias
            </div>
          </div>
        </div>
        
        <div className="tarjeta p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gris-500">Mensajes recibidos</p>
              <p className="text-2xl font-semibold text-gris-900 mt-1">{estadisticas.mensajesRecibidos}</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {calcularTendencia(estadisticas.mensajesRecibidos, 145)}
            <div className="flex items-center text-xs font-medium text-gris-500">
              <span className="inline-block w-3 h-3 rounded-full bg-primario mr-1"></span>
              <span className="text-gris-900">{Math.round(estadisticas.mensajesRecibidos * 0.7)}</span> respondidos
            </div>
          </div>
        </div>
        
        <div className="tarjeta p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gris-500">Tiempo de respuesta</p>
              <p className="text-2xl font-semibold text-gris-900 mt-1">{estadisticas.tiempoRespuestaPromedio} min</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-green-50 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {calcularTendencia(4.5, estadisticas.tiempoRespuestaPromedio)}
            <div className="text-xs font-medium">
              <span className={`px-1.5 py-0.5 rounded ${estadisticas.tiempoRespuestaPromedio < 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {estadisticas.tiempoRespuestaPromedio < 5 ? 'Excelente' : 'Regular'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="tarjeta p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gris-500">Tasa de resolución</p>
              <p className="text-2xl font-semibold text-gris-900 mt-1">{estadisticas.tasaResolucion}%</p>
            </div>
            <div className="h-12 w-12 rounded-md bg-yellow-50 flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {calcularTendencia(estadisticas.tasaResolucion, 80)}
            <div className="text-xs font-medium">
              <span className={estadisticas.tasaResolucion > 85 ? 'text-green-600' : 'text-yellow-600'}>
                Meta: 85%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta p-5">
          <h3 className="text-lg font-bold text-gris-900 mb-4">Conversaciones por día</h3>
          <div className="h-80">
            <Line 
              data={datosConversaciones} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="tarjeta p-5">
          <h3 className="text-lg font-bold text-gris-900 mb-4">Mensajes por canal</h3>
          <div className="h-80">
            <Bar 
              data={datosMensajesPorCanal} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="tarjeta p-5 lg:col-span-1">
          <h3 className="text-lg font-bold text-gris-900 mb-4">Estado de conversaciones</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48">
              <Doughnut 
                data={datosEstadoConversaciones} 
                options={{
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="tarjeta p-5 lg:col-span-2">
          <h3 className="text-lg font-bold text-gris-900 mb-4">Agentes más activos</h3>
          <div className="divide-y divide-gris-200">
            {[
              { nombre: 'Ana Martínez', mensajes: 156, foto: 'AM' },
              { nombre: 'Carlos Sánchez', mensajes: 132, foto: 'CS' },
              { nombre: 'Laura Gómez', mensajes: 98, foto: 'LG' },
              { nombre: 'Javier Pérez', mensajes: 76, foto: 'JP' }
            ].map((agente, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primario-light text-white flex items-center justify-center font-medium">
                    {agente.foto}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gris-900">{agente.nombre}</p>
                    <p className="text-xs text-gris-500">{agente.mensajes} mensajes enviados</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    index === 0 ? 'bg-green-100 text-green-800' : 
                    index === 1 ? 'bg-blue-100 text-blue-800' : 
                    'bg-gris-100 text-gris-800'
                  }`}>
                    {index === 0 ? 'Top' : index === 1 ? '2do' : `${index + 1}ro`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sección de recomendaciones */}
      <div className="tarjeta p-5">
        <h3 className="text-lg font-bold text-gris-900 mb-4">Recomendaciones Inteligentes</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h4 className="font-medium text-blue-800">Optimizar tiempo de respuesta</h4>
            <p className="text-sm text-gris-600 mt-1">
              El tiempo de respuesta ha mejorado un 15%. Sigue utilizando respuestas rápidas para mantener esta tendencia.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h4 className="font-medium text-yellow-800">Pendientes de resolución</h4>
            <p className="text-sm text-gris-600 mt-1">
              Hay 15 conversaciones en estado pendiente. Se recomienda asignar estas conversaciones a los agentes disponibles.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <h4 className="font-medium text-green-800">Alta efectividad en WhatsApp</h4>
            <p className="text-sm text-gris-600 mt-1">
              El canal de WhatsApp muestra la mayor tasa de respuesta y resolución. Considere redirigir más tráfico hacia este canal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
