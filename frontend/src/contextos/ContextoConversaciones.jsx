import { createContext, useState, useContext, useEffect } from 'react';
import { servicioConversaciones, servicioWhatsApp } from '../servicios/api';

const ContextoConversaciones = createContext();

export function ProveedorConversaciones({ children }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarConversaciones();
  }, []);

  const cargarConversaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // En un entorno de producción, esto usaría el servicio real
      // const datos = await servicioConversaciones.obtenerTodas();
      
      // Datos de ejemplo para desarrollo
      const datosEjemplo = [
        {
          id: 1,
          idChatwoot: 123,
          numeroTelefono: '+573001234567',
          nombreContacto: 'Juan Pérez',
          estado: 'ABIERTA',
          fechaActualizacion: '2025-05-16T10:30:00',
          mensajes: [
            {
              id: 101,
              contenido: 'Hola, necesito información sobre sus servicios',
              direccion: 'ENTRANTE',
              fechaEnvio: '2025-05-16T10:25:00'
            },
            {
              id: 102,
              contenido: '¡Claro! Estamos para ayudarte. ¿Qué tipo de información necesitas?',
              direccion: 'SALIENTE',
              fechaEnvio: '2025-05-16T10:30:00'
            }
          ]
        },
        {
          id: 2,
          idChatwoot: 124,
          numeroTelefono: '+573009876543',
          nombreContacto: 'María López',
          estado: 'PENDIENTE',
          fechaActualizacion: '2025-05-16T09:15:00',
          mensajes: [
            {
              id: 201,
              contenido: 'Tengo un problema con mi pedido #12345',
              direccion: 'ENTRANTE',
              fechaEnvio: '2025-05-16T09:10:00'
            }
          ]
        }
      ];
      
      setConversaciones(datosEjemplo);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('No se pudieron cargar las conversaciones. Intenta de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const crearConversacion = async (numeroTelefono, nombreContacto) => {
    try {
      // En producción, esto llamaría al servicio real
      // const nuevaConversacion = await servicioConversaciones.crear(numeroTelefono, nombreContacto);
      
      // Simulamos la creación para desarrollo
      const nuevaConversacion = {
        id: Date.now(),
        idChatwoot: Date.now(),
        numeroTelefono,
        nombreContacto,
        estado: 'ABIERTA',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        mensajes: []
      };
      
      setConversaciones(prevConversaciones => [...prevConversaciones, nuevaConversacion]);
      return nuevaConversacion;
    } catch (err) {
      console.error('Error al crear conversación:', err);
      throw err;
    }
  };

  const enviarMensaje = async (idConversacion, idConversacionChatwoot, contenido) => {
    try {
      // En producción, esto llamaría al servicio real
      // const mensajeEnviado = await servicioConversaciones.enviarMensaje(idConversacionChatwoot, contenido);
      
      // Simulamos el envío para desarrollo
      const mensajeEnviado = {
        id: Date.now(),
        idChatwoot: Date.now(),
        contenido,
        tipo: 'TEXTO',
        direccion: 'SALIENTE',
        fechaEnvio: new Date().toISOString(),
        leido: true
      };
      
      // Actualizamos el estado local
      setConversaciones(prevConversaciones => 
        prevConversaciones.map(conv => {
          if (conv.id === idConversacion) {
            return {
              ...conv,
              fechaActualizacion: new Date().toISOString(),
              mensajes: [...conv.mensajes, mensajeEnviado]
            };
          }
          return conv;
        })
      );
      
      return mensajeEnviado;
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      throw err;
    }
  };

  const enviarMensajeWhatsApp = async (numeroDestino, contenido) => {
    try {
      // En producción, esto llamaría al servicio real
      // const mensajeEnviado = await servicioWhatsApp.enviarMensaje(numeroDestino, contenido);
      
      // Buscamos si ya existe una conversación con ese número
      let conversacion = conversaciones.find(c => c.numeroTelefono === numeroDestino);
      
      // Si no existe, creamos una nueva
      if (!conversacion) {
        conversacion = await crearConversacion(numeroDestino, `Usuario ${numeroDestino}`);
      }
      
      // Enviamos el mensaje a esa conversación
      return await enviarMensaje(conversacion.id, conversacion.idChatwoot, contenido);
    } catch (err) {
      console.error('Error al enviar mensaje de WhatsApp:', err);
      throw err;
    }
  };

  const valor = {
    conversaciones,
    cargando,
    error,
    cargarConversaciones,
    crearConversacion,
    enviarMensaje,
    enviarMensajeWhatsApp
  };

  return (
    <ContextoConversaciones.Provider value={valor}>
      {children}
    </ContextoConversaciones.Provider>
  );
}

export function useConversaciones() {
  const contexto = useContext(ContextoConversaciones);
  if (!contexto) {
    throw new Error('useConversaciones debe ser usado dentro de un ProveedorConversaciones');
  }
  return contexto;
}

export default ContextoConversaciones;
