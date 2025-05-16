import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DetalleConversacion({ conversacion, setConversacionSeleccionada }) {
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mostrarRespuestasRapidas, setMostrarRespuestasRapidas] = useState(false);
  const [mostrarPanelInfo, setMostrarPanelInfo] = useState(false);
  const [notaInterna, setNotaInterna] = useState('');
  const [notas, setNotas] = useState([]);
  const [adjuntos, setAdjuntos] = useState([]);
  const mensajesContenedorRef = useRef(null);
  const adjuntoRef = useRef(null);
  
  // Auto scroll al último mensaje cuando se carga o actualiza la conversación
  useEffect(() => {
    if (mensajesContenedorRef.current) {
      mensajesContenedorRef.current.scrollTop = mensajesContenedorRef.current.scrollHeight;
    }
  }, [conversacion]);

  const formatearTiempo = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
    } catch (e) {
      return "fecha desconocida";
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

  const enviarMensaje = (e) => {
    e && e.preventDefault();
    if (nuevoMensaje.trim() === '') return;
    
    // Aquí iría la lógica para enviar el mensaje a través de la API
    console.log(`Enviando mensaje a ${conversacion.nombreContacto}: ${nuevoMensaje}`);
    
    // Simulamos añadir el mensaje (en producción, esto vendría de la respuesta de la API)
    const mensajeSimulado = {
      id: Math.floor(Math.random() * 10000),
      contenido: nuevoMensaje,
      tipo: adjuntos.length > 0 ? 'MULTIMEDIA' : 'TEXTO',
      archivos: [...adjuntos],
      direccion: 'SALIENTE',
      fechaEnvio: new Date().toISOString()
    };
    
    // Añadimos el mensaje simulado (en producción, deberíamos actualizar el estado desde la API)
    conversacion.mensajes.push(mensajeSimulado);
    
    // Limpiamos el campo de texto y adjuntos
    setNuevoMensaje('');
    setAdjuntos([]);
    setMostrarRespuestasRapidas(false);
    
    // Auto scroll al final
    setTimeout(() => {
      if (mensajesContenedorRef.current) {
        mensajesContenedorRef.current.scrollTop = mensajesContenedorRef.current.scrollHeight;
      }
    }, 100);
  };
  
  const usarRespuestaRapida = (respuesta) => {
    setNuevoMensaje(respuesta);
    setMostrarRespuestasRapidas(false);
  };
  
  const guardarNota = () => {
    if (notaInterna.trim() === '') return;
    
    const nuevaNota = {
      id: notas.length + 1,
      texto: notaInterna,
      fecha: new Date().toISOString()
    };
    
    setNotas([...notas, nuevaNota]);
    setNotaInterna('');
  };
  
  const manejarAdjunto = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const nuevosAdjuntos = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      nombre: file.name,
      tipo: file.type,
      tamano: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setAdjuntos([...adjuntos, ...nuevosAdjuntos]);
  };
  
  const eliminarAdjunto = (id) => {
    setAdjuntos(adjuntos.filter(adj => adj.id !== id));
  };

  return (
    <div className="flex h-full">
      {/* Panel principal de conversación */}
      <div className="tarjeta h-full flex flex-col flex-grow">
        {/* Cabecera */}
        <div className="p-4 border-b border-gris-200 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setConversacionSeleccionada(null)} 
              className="mr-2 sm:hidden"
            >
              <svg className="h-5 w-5 text-gris-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div>
              <h2 className="text-lg font-bold text-gris-900">{conversacion.nombreContacto}</h2>
              <div className="flex flex-wrap items-center text-sm text-gris-600 mt-1">
                <span>{conversacion.numeroTelefono}</span>
                <span className="mx-2">•</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${obtenerColorEstado(conversacion.estado)} bg-opacity-20 text-gris-800`}>
                  {obtenerTextoEstado(conversacion.estado)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setMostrarPanelInfo(!mostrarPanelInfo)}
              className={`p-2 rounded-full hover:bg-gris-100 ${mostrarPanelInfo ? 'text-primario bg-primario bg-opacity-10' : 'text-gris-600 hover:text-primario'}`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="relative">
              <button className="p-2 text-gris-600 hover:text-primario rounded-full hover:bg-gris-100">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              {/* Menú desplegable (oculto por defecto) */}
            </div>
          </div>
        </div>
        
        {/* Área de mensajes */}
        <div ref={mensajesContenedorRef} className="flex-1 p-4 overflow-y-auto">
          {conversacion.mensajes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gris-500">No hay mensajes en esta conversación</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversacion.mensajes.map((mensaje) => (
                <div 
                  key={mensaje.id} 
                  className={`flex ${mensaje.direccion === 'ENTRANTE' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      mensaje.direccion === 'ENTRANTE' 
                        ? 'bg-gris-200 text-gris-900' 
                        : 'bg-primario text-white'
                    }`}
                  >
                    <p>{mensaje.contenido}</p>
                    
                    {/* Archivos adjuntos si hay */}
                    {mensaje.archivos && mensaje.archivos.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {mensaje.archivos.map(archivo => (
                          <div key={archivo.id} className="rounded bg-white bg-opacity-10 p-2 flex items-center">
                            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <div className="flex-1 truncate">
                              <p className="text-sm font-medium truncate">{archivo.nombre}</p>
                              <p className="text-xs opacity-70">{Math.round(archivo.tamano / 1024)} KB</p>
                            </div>
                            <a href={archivo.url} target="_blank" rel="noreferrer" className="text-xs underline ml-2">Ver</a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      mensaje.direccion === 'ENTRANTE' ? 'text-gris-500' : 'text-primario-light'
                    }`}>
                      {formatearTiempo(mensaje.fechaEnvio)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Adjuntos seleccionados */}
        {adjuntos.length > 0 && (
          <div className="px-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {adjuntos.map(adj => (
                <div key={adj.id} className="bg-gris-100 rounded-md p-2 flex items-center">
                  <span className="text-xs mr-2 truncate max-w-[100px]">{adj.nombre}</span>
                  <button
                    onClick={() => eliminarAdjunto(adj.id)}
                    className="text-gris-500 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Panel de respuestas rápidas */}
        {mostrarRespuestasRapidas && (
          <div className="px-4 py-2 border-t border-gris-200">
            <h4 className="text-sm font-medium text-gris-700 mb-2">Respuestas rápidas</h4>
            <div className="flex flex-wrap gap-2">
              {[
                '¡Hola! ¿En qué podemos ayudarte?',
                'Gracias por contactarnos',
                'Un momento por favor',
                'Entiendo tu situación',
                'Lamento los inconvenientes',
                'Estamos verificando tu caso',
                'Le informaremos al departamento correspondiente',
                '¿Hay algo más en lo que podamos ayudarte?'
              ].map((resp, idx) => (
                <button 
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-full bg-primario bg-opacity-10 text-primario hover:bg-opacity-20 transition-colors"
                  onClick={() => usarRespuestaRapida(resp)}
                >
                  {resp}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Formulario de envío */}
        <div className="p-4 border-t border-gris-200">
          <form onSubmit={enviarMensaje} className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 border border-gris-300 rounded-full px-4 py-2 focus:ring-primario focus:border-primario"
                placeholder="Escribe tu mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
              />
              
              <button 
                type="submit"
                className="p-2 bg-primario text-white rounded-full hover:bg-primario-dark focus:ring-2 focus:ring-offset-2 focus:ring-primario-dark"
                disabled={nuevoMensaje.trim() === '' && adjuntos.length === 0}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-between">
              <div className="flex space-x-1">
                <button 
                  type="button"
                  onClick={() => adjuntoRef.current?.click()}
                  className="p-1.5 text-gris-600 hover:text-primario rounded-full hover:bg-gris-100"
                  title="Adjuntar archivo"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <input 
                    type="file" 
                    ref={adjuntoRef} 
                    onChange={manejarAdjunto} 
                    className="hidden" 
                    multiple 
                  />
                </button>
                
                <button 
                  type="button"
                  onClick={() => setMostrarRespuestasRapidas(!mostrarRespuestasRapidas)}
                  className={`p-1.5 rounded-full ${mostrarRespuestasRapidas ? 'text-primario bg-primario bg-opacity-10' : 'text-gris-600 hover:text-primario hover:bg-gris-100'}`}
                  title="Respuestas rápidas"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
              
              <div>
                <button 
                  type="button"
                  className="p-1.5 text-primario hover:bg-gris-100 rounded-full"
                  title="Más opciones"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Panel lateral de información - visible solo cuando está activo */}
      {mostrarPanelInfo && (
        <div className="hidden md:block w-80 h-full ml-4 overflow-auto">
          <div className="tarjeta h-full p-4 flex flex-col">
            <div className="border-b border-gris-200 pb-4">
              <h2 className="text-lg font-medium text-gris-900">Información</h2>
            </div>
            
            {/* Datos del contacto */}
            <div className="py-4 border-b border-gris-200">
              <h3 className="text-sm font-medium text-gris-700 mb-3">Datos del contacto</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gris-500">Nombre</p>
                  <p className="text-sm text-gris-900">{conversacion.nombreContacto}</p>
                </div>
                <div>
                  <p className="text-xs text-gris-500">Teléfono</p>
                  <p className="text-sm text-gris-900">{conversacion.numeroTelefono}</p>
                </div>
                <div>
                  <p className="text-xs text-gris-500">Creado</p>
                  <p className="text-sm text-gris-900">{formatearTiempo(conversacion.fechaCreacion)}</p>
                </div>
              </div>
            </div>
            
            {/* Asignación y etiquetas */}
            <div className="py-4 border-b border-gris-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gris-700">Asignado a</h3>
                <button className="text-xs text-primario hover:text-primario-dark">Cambiar</button>
              </div>
              
              {conversacion.agente ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primario-light text-white flex items-center justify-center mr-2">
                    {conversacion.agente.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gris-900">{conversacion.agente.nombre}</p>
                    <p className="text-xs text-gris-500">{conversacion.agente.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gris-500">No asignado</p>
              )}
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gris-700">Etiquetas</h3>
                  <button className="text-xs text-primario hover:text-primario-dark">Añadir</button>
                </div>
                
                {conversacion.etiquetas && conversacion.etiquetas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {conversacion.etiquetas.map(etiqueta => (
                      <span 
                        key={etiqueta.id} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${etiqueta.color}20`, color: etiqueta.color }}
                      >
                        {etiqueta.nombre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gris-500">Sin etiquetas</p>
                )}
              </div>
            </div>
            
            {/* Notas internas */}
            <div className="py-4 flex-grow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gris-700">Notas internas</h3>
              </div>
              
              <div className="space-y-3">
                {notas.length > 0 ? (
                  notas.map(nota => (
                    <div key={nota.id} className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-sm text-gris-800">{nota.texto}</p>
                      <p className="text-xs text-gris-500 mt-1">{formatearTiempo(nota.fecha)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gris-500">No hay notas internas</p>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <textarea
                  className="w-full text-sm border border-gris-300 rounded-md px-3 py-2 focus:ring-primario focus:border-primario"
                  placeholder="Añadir nota interna..."
                  rows="3"
                  value={notaInterna}
                  onChange={(e) => setNotaInterna(e.target.value)}
                />
                <button 
                  onClick={guardarNota}
                  disabled={!notaInterna.trim()}
                  className="w-full px-3 py-1.5 text-sm bg-primario text-white rounded-md hover:bg-primario-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
