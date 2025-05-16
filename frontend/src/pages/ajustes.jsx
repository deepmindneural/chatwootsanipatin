import { useState } from 'react';
import Head from 'next/head';

export default function PaginaAjustes() {
  const [formularioConfiguracion, setFormularioConfiguracion] = useState({
    urlChatwoot: 'https://app.chatwoot.com',
    apiKeyChatwoot: '',
    cuentaIdChatwoot: '1',
    webhookTokenChatwoot: '',
    proveedorWhatsApp: '360dialog',
    apiKeyWhatsApp: '',
    numeroTelefonoWhatsApp: '',
    urlBackend: 'http://localhost:8080'
  });
  const [formularioNotificaciones, setFormularioNotificaciones] = useState({
    notificacionesEmail: true,
    notificacionesPush: true,
    notificacionesSonido: true,
    emailNotificaciones: '',
    tiempoInactividad: '30'
  });
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const handleConfiguracionChange = (e) => {
    const { name, value } = e.target;
    setFormularioConfiguracion({
      ...formularioConfiguracion,
      [name]: value
    });
  };

  const handleNotificacionesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormularioNotificaciones({
      ...formularioNotificaciones,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const guardarConfiguracion = (e) => {
    e.preventDefault();
    setGuardando(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setGuardando(false);
      setMensajeExito('Configuración guardada correctamente');
      
      setTimeout(() => {
        setMensajeExito('');
      }, 3000);
    }, 1000);
  };

  const guardarNotificaciones = (e) => {
    e.preventDefault();
    setGuardando(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setGuardando(false);
      setMensajeExito('Configuración de notificaciones guardada correctamente');
      
      setTimeout(() => {
        setMensajeExito('');
      }, 3000);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Ajustes - Chatwoot Sanipatin</title>
        <meta name="description" content="Configuración de la integración de Chatwoot con WhatsApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gris-900 mb-6">Ajustes de la Plataforma</h1>
            
            {mensajeExito && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                {mensajeExito}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuración de integración */}
              <div className="tarjeta">
                <h2 className="text-xl font-bold text-gris-900 mb-4 pb-2 border-b border-gris-200">
                  Configuración de Integración
                </h2>
                
                <form onSubmit={guardarConfiguracion} className="space-y-4">
                  <div>
                    <label htmlFor="urlChatwoot" className="block text-sm font-medium text-gris-700 mb-1">
                      URL de Chatwoot
                    </label>
                    <input
                      type="text"
                      id="urlChatwoot"
                      name="urlChatwoot"
                      value={formularioConfiguracion.urlChatwoot}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apiKeyChatwoot" className="block text-sm font-medium text-gris-700 mb-1">
                      API Key de Chatwoot
                    </label>
                    <input
                      type="password"
                      id="apiKeyChatwoot"
                      name="apiKeyChatwoot"
                      value={formularioConfiguracion.apiKeyChatwoot}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cuentaIdChatwoot" className="block text-sm font-medium text-gris-700 mb-1">
                      ID de Cuenta Chatwoot
                    </label>
                    <input
                      type="text"
                      id="cuentaIdChatwoot"
                      name="cuentaIdChatwoot"
                      value={formularioConfiguracion.cuentaIdChatwoot}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="webhookTokenChatwoot" className="block text-sm font-medium text-gris-700 mb-1">
                      Token de Webhook Chatwoot
                    </label>
                    <input
                      type="password"
                      id="webhookTokenChatwoot"
                      name="webhookTokenChatwoot"
                      value={formularioConfiguracion.webhookTokenChatwoot}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="proveedorWhatsApp" className="block text-sm font-medium text-gris-700 mb-1">
                      Proveedor de WhatsApp
                    </label>
                    <select
                      id="proveedorWhatsApp"
                      name="proveedorWhatsApp"
                      value={formularioConfiguracion.proveedorWhatsApp}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    >
                      <option value="360dialog">360dialog</option>
                      <option value="twilio">Twilio</option>
                      <option value="meta">Meta Business API</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="apiKeyWhatsApp" className="block text-sm font-medium text-gris-700 mb-1">
                      API Key de WhatsApp
                    </label>
                    <input
                      type="password"
                      id="apiKeyWhatsApp"
                      name="apiKeyWhatsApp"
                      value={formularioConfiguracion.apiKeyWhatsApp}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="numeroTelefonoWhatsApp" className="block text-sm font-medium text-gris-700 mb-1">
                      Número de Teléfono de WhatsApp
                    </label>
                    <input
                      type="text"
                      id="numeroTelefonoWhatsApp"
                      name="numeroTelefonoWhatsApp"
                      value={formularioConfiguracion.numeroTelefonoWhatsApp}
                      onChange={handleConfiguracionChange}
                      className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                      placeholder="+573001234567"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="boton-primario"
                      disabled={guardando}
                    >
                      {guardando ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Configuración de notificaciones */}
              <div className="space-y-6">
                <div className="tarjeta">
                  <h2 className="text-xl font-bold text-gris-900 mb-4 pb-2 border-b border-gris-200">
                    Configuración de Notificaciones
                  </h2>
                  
                  <form onSubmit={guardarNotificaciones} className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notificacionesEmail"
                        name="notificacionesEmail"
                        checked={formularioNotificaciones.notificacionesEmail}
                        onChange={handleNotificacionesChange}
                        className="h-4 w-4 text-primario border-gris-300 focus:ring-primario"
                      />
                      <label htmlFor="notificacionesEmail" className="ml-2 block text-sm text-gris-700">
                        Recibir notificaciones por correo electrónico
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notificacionesPush"
                        name="notificacionesPush"
                        checked={formularioNotificaciones.notificacionesPush}
                        onChange={handleNotificacionesChange}
                        className="h-4 w-4 text-primario border-gris-300 focus:ring-primario"
                      />
                      <label htmlFor="notificacionesPush" className="ml-2 block text-sm text-gris-700">
                        Recibir notificaciones push en el navegador
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notificacionesSonido"
                        name="notificacionesSonido"
                        checked={formularioNotificaciones.notificacionesSonido}
                        onChange={handleNotificacionesChange}
                        className="h-4 w-4 text-primario border-gris-300 focus:ring-primario"
                      />
                      <label htmlFor="notificacionesSonido" className="ml-2 block text-sm text-gris-700">
                        Reproducir sonido en nuevas notificaciones
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="emailNotificaciones" className="block text-sm font-medium text-gris-700 mb-1">
                        Correo electrónico para notificaciones
                      </label>
                      <input
                        type="email"
                        id="emailNotificaciones"
                        name="emailNotificaciones"
                        value={formularioNotificaciones.emailNotificaciones}
                        onChange={handleNotificacionesChange}
                        className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="tiempoInactividad" className="block text-sm font-medium text-gris-700 mb-1">
                        Tiempo de inactividad para marcar ausencia (minutos)
                      </label>
                      <input
                        type="number"
                        id="tiempoInactividad"
                        name="tiempoInactividad"
                        value={formularioNotificaciones.tiempoInactividad}
                        onChange={handleNotificacionesChange}
                        className="w-full rounded-md border-gris-300 shadow-sm focus:ring-primario focus:border-primario"
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="boton-primario"
                        disabled={guardando}
                      >
                        {guardando ? 'Guardando...' : 'Guardar Notificaciones'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Sección de documentación */}
                <div className="tarjeta">
                  <h2 className="text-xl font-bold text-gris-900 mb-4 pb-2 border-b border-gris-200">
                    Documentación y Ayuda
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-md font-semibold text-gris-800">Enlaces útiles</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>
                          <a href="#" className="text-primario hover:underline">Manual de usuario de Chatwoot</a>
                        </li>
                        <li>
                          <a href="#" className="text-primario hover:underline">Guía de integración con WhatsApp</a>
                        </li>
                        <li>
                          <a href="#" className="text-primario hover:underline">Documentación de la API</a>
                        </li>
                        <li>
                          <a href="#" className="text-primario hover:underline">Preguntas frecuentes</a>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-semibold text-gris-800">Soporte técnico</h3>
                      <p className="mt-2 text-sm text-gris-600">
                        Para consultas técnicas, envíe un correo electrónico a: <a href="mailto:soporte@ejemplo.com" className="text-primario hover:underline">soporte@ejemplo.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </>
  );
}
