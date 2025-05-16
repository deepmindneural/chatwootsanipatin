import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Añadir logs para depuración
const logRequest = (method, endpoint, data) => {
  console.log(`[API] ${method} ${endpoint}`, data || '');
};

const logResponse = (method, endpoint, response) => {
  console.log(`[API] Response from ${method} ${endpoint}:`, response);
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const servicioConversaciones = {
  obtenerTodas: async () => {
    try {
      logRequest('GET', '/conversaciones');
      const respuesta = await api.get('/conversaciones');
      logResponse('GET', '/conversaciones', respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener conversaciones:', error);
      // Para este modo de desarrollo, retornar datos simulados en caso de error
      console.log('Usando datos simulados para desarrollo');
      return [
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
    }
  },
  
  crear: async (numeroTelefono, nombreContacto) => {
    try {
      const respuesta = await api.post('/conversaciones', { numeroTelefono, nombreContacto });
      return respuesta.data;
    } catch (error) {
      console.error('Error al crear conversación:', error);
      throw error;
    }
  },
  
  enviarMensaje: async (idConversacionChatwoot, contenido) => {
    try {
      const respuesta = await api.post(`/conversaciones/${idConversacionChatwoot}/mensajes`, { contenido });
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }
};

export const servicioWhatsApp = {
  enviarMensaje: async (numeroDestino, contenido) => {
    try {
      const respuesta = await api.post('/whatsapp/enviar', { numeroDestino, contenido });
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar mensaje WhatsApp:', error);
      throw error;
    }
  }
};

export default api;
