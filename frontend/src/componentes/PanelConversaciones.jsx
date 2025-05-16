import { useState, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import DetalleConversacion from './DetalleConversacion';

export default function PanelConversaciones({ conversaciones }) {
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroAgente, setFiltroAgente] = useState('TODOS');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('TODOS');
  const [filtroFecha, setFiltroFecha] = useState('CUALQUIERA');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [conversacionesFiltradas, setConversacionesFiltradas] = useState([]);
  
  // Lista única de agentes y etiquetas para los filtros
  const agentesUnicos = [
    { id: 'TODOS', nombre: 'Todos los agentes' },
    ...Array.from(
      new Set(
        conversaciones
          .filter(c => c.agente)
          .map(c => JSON.stringify({ id: c.agente.id, nombre: c.agente.nombre }))
      )
    ).map(json => JSON.parse(json))
  ];
  
  const etiquetasUnicas = [
    { id: 'TODOS', nombre: 'Todas las etiquetas' },
    ...Array.from(
      new Set(
        conversaciones
          .flatMap(c => c.etiquetas || [])
          .map(e => JSON.stringify({ id: e.id, nombre: e.nombre, color: e.color }))
      )
    ).map(json => JSON.parse(json))
  ];

  // Inicializar el estado de conversaciones filtradas
  useEffect(() => {
    try {
      // Asegurarnos de que conversaciones es un array
      if (!Array.isArray(conversaciones)) {
        console.error('conversaciones no es un array:', conversaciones);
        setConversacionesFiltradas([]);
        return;
      }
      
      const filtradas = conversaciones.filter(conversacion => {
        // Verificar que conversacion no sea null o undefined
        if (!conversacion) return false;
        
        try {
          // Filtro de búsqueda en nombre o número
          const coincideBusqueda = 
            filtroBusqueda === '' ||
            (conversacion.nombreContacto && conversacion.nombreContacto.toLowerCase().includes(filtroBusqueda.toLowerCase())) ||
            (conversacion.numeroTelefono && conversacion.numeroTelefono.includes(filtroBusqueda)) ||
            (conversacion.mensajes && Array.isArray(conversacion.mensajes) && conversacion.mensajes.some(m => 
              m && m.contenido && m.contenido.toLowerCase().includes(filtroBusqueda.toLowerCase())
            ));
          
          // Filtro por estado
          const coincideEstado = 
            filtroEstado === 'TODOS' || 
            (conversacion.estado && conversacion.estado === filtroEstado);
          
          // Filtro por agente
          const coincideAgente =
            filtroAgente === 'TODOS' ||
            (conversacion.agente && conversacion.agente.id && conversacion.agente.id.toString() === filtroAgente);
          
          // Filtro por etiqueta
          const coincideEtiqueta =
            filtroEtiqueta === 'TODOS' ||
            (conversacion.etiquetas && Array.isArray(conversacion.etiquetas) && 
             conversacion.etiquetas.some(e => e && e.id && e.id.toString() === filtroEtiqueta));
          
          // Filtro por fecha
          let coincideFecha = true;
          
          if (conversacion.fechaActualizacion && filtroFecha !== 'CUALQUIERA') {
            const ahora = new Date();
            const fechaConversacion = new Date(conversacion.fechaActualizacion);
            
            if (filtroFecha === 'HOY') {
              coincideFecha = fechaConversacion.toDateString() === ahora.toDateString();
            } else if (filtroFecha === 'SEMANA') {
              const unaSemanaMilisegundos = 7 * 24 * 60 * 60 * 1000;
              coincideFecha = (ahora - fechaConversacion) <= unaSemanaMilisegundos;
            } else if (filtroFecha === 'MES') {
              coincideFecha = 
                fechaConversacion.getMonth() === ahora.getMonth() && 
                fechaConversacion.getFullYear() === ahora.getFullYear();
            }
          }
          
          return coincideBusqueda && coincideEstado && coincideAgente && coincideEtiqueta && coincideFecha;
        } catch (error) {
          console.error('Error filtrando conversación:', error, conversacion);
          return false;
        }
      });
      
      setConversacionesFiltradas(filtradas);
    } catch (error) {
      console.error('Error general en el filtrado:', error);
      setConversacionesFiltradas([]);
    }
  }, [conversaciones, filtroBusqueda, filtroEstado, filtroAgente, filtroEtiqueta, filtroFecha]);

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'ABIERTA':
        return 'bg-estado-activo';
      case 'PENDIENTE':
        return 'bg-estado-pendiente';
      case 'RESUELTA':
        return 'bg-estado-resuelto';
      default:
        return 'bg-estado-cerrado';
    }
  };
  
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'ABIERTA':
        return 'Abierta';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'RESUELTA':
        return 'Resuelta';
      default:
        return 'Desconocido';
    }
  };

  const formatearTiempo = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
    } catch (e) {
      return "fecha desconocida";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)]">
      <div className="w-full lg:w-1/3 lg:pr-4 mb-4 lg:mb-0 lg:h-full overflow-auto">
        <div className="tarjeta h-full flex flex-col">
          <div className="p-4 border-b border-gris-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-xl font-bold text-gris-900 mb-2 sm:mb-0">Conversaciones</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded-md text-sm focus:outline-none transition-colors ${mostrarFiltrosAvanzados ? 'bg-primario text-white' : 'bg-gris-100 text-gris-800 hover:bg-gris-200'}`}
                  onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                >
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtros
                  </div>
                </button>
                <button className="boton-primario text-sm py-1">Nueva</button>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gris-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o contenido..."
                  className="w-full pl-10 rounded-md border border-gris-300 px-3 py-2 focus:ring-primario focus:border-primario"
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filtros avanzados - visible solo cuando están activados */}
            {mostrarFiltrosAvanzados && (
              <div className="mt-3 p-3 bg-gris-50 rounded-md border border-gris-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gris-700 mb-1">Estado</label>
                    <select 
                      className="w-full px-3 py-1.5 rounded-md border border-gris-300 text-sm focus:ring-primario focus:border-primario"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="TODOS">Todos</option>
                      <option value="ABIERTA">Abiertas</option>
                      <option value="PENDIENTE">Pendientes</option>
                      <option value="RESUELTA">Resueltas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gris-700 mb-1">Agente</label>
                    <select 
                      className="w-full px-3 py-1.5 rounded-md border border-gris-300 text-sm focus:ring-primario focus:border-primario"
                      value={filtroAgente}
                      onChange={(e) => setFiltroAgente(e.target.value)}
                    >
                      {agentesUnicos.map(agente => (
                        <option key={agente.id} value={agente.id}>{agente.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gris-700 mb-1">Etiqueta</label>
                    <select 
                      className="w-full px-3 py-1.5 rounded-md border border-gris-300 text-sm focus:ring-primario focus:border-primario"
                      value={filtroEtiqueta}
                      onChange={(e) => setFiltroEtiqueta(e.target.value)}
                    >
                      {etiquetasUnicas.map(etiqueta => (
                        <option key={etiqueta.id} value={etiqueta.id}>{etiqueta.nombre}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gris-700 mb-1">Fecha</label>
                    <select 
                      className="w-full px-3 py-1.5 rounded-md border border-gris-300 text-sm focus:ring-primario focus:border-primario"
                      value={filtroFecha}
                      onChange={(e) => setFiltroFecha(e.target.value)}
                    >
                      <option value="CUALQUIERA">Cualquier fecha</option>
                      <option value="HOY">Hoy</option>
                      <option value="SEMANA">Esta semana</option>
                      <option value="MES">Este mes</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button 
                    className="px-3 py-1 text-xs text-gris-700 hover:text-gris-900 focus:outline-none"
                    onClick={() => {
                      setFiltroBusqueda('');
                      setFiltroEstado('TODOS');
                      setFiltroAgente('TODOS');
                      setFiltroEtiqueta('TODOS');
                      setFiltroFecha('CUALQUIERA');
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-auto">
            {conversacionesFiltradas.length === 0 ? (
              <div className="p-4 text-center text-gris-500">
                No se encontraron conversaciones
              </div>
            ) : (
              <ul className="divide-y divide-gris-200">
                {conversacionesFiltradas.map((conversacion) => (
                  <li 
                    key={conversacion.id}
                    className={`hover:bg-gris-100 cursor-pointer transition-all duration-150 ${
                      conversacionSeleccionada?.id === conversacion.id ? 'bg-gris-100 border-l-4 border-primario' : ''
                    }`}
                    onClick={() => setConversacionSeleccionada(conversacion)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gris-900 mr-2">{conversacion.nombreContacto}</h3>
                            {conversacion.etiquetas && conversacion.etiquetas.length > 0 && (
                              <div className="flex space-x-1">
                                {conversacion.etiquetas.slice(0, 2).map(etiqueta => (
                                  <span 
                                    key={etiqueta.id} 
                                    className="inline-block w-2 h-2 rounded-full"
                                    style={{ backgroundColor: etiqueta.color }}
                                    title={etiqueta.nombre}
                                  ></span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gris-500 mt-0.5">{conversacion.numeroTelefono}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gris-500 whitespace-nowrap">{formatearTiempo(conversacion.fechaActualizacion)}</span>
                          <div className="flex items-center mt-1">
                            <span className={`w-2 h-2 rounded-full ${obtenerColorEstado(conversacion.estado)}`}></span>
                            <span className="text-xs text-gris-500 ml-1">{obtenerTextoEstado(conversacion.estado)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-start">
                          {conversacion.agente && (
                            <div className="h-6 w-6 rounded-full bg-primario-light text-white flex items-center justify-center text-xs mr-2 flex-shrink-0">
                              {conversacion.agente.avatar}
                            </div>
                          )}
                          <p className="text-xs text-gris-600 truncate">
                            {conversacion.mensajes && conversacion.mensajes.length > 0
                              ? conversacion.mensajes[conversacion.mensajes.length - 1].contenido
                              : 'No hay mensajes'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-2/3 lg:h-full overflow-auto">
        {conversacionSeleccionada ? (
          <DetalleConversacion 
            conversacion={conversacionSeleccionada} 
            setConversacionSeleccionada={setConversacionSeleccionada}
          />
        ) : (
          <div className="tarjeta h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gris-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gris-900">No hay conversación seleccionada</h3>
              <p className="mt-1 text-sm text-gris-500">
                Selecciona una conversación de la lista para ver sus detalles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
