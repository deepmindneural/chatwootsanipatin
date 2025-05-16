import { useState, useEffect } from 'react';
import Head from 'next/head';
import PanelConversaciones from '../componentes/PanelConversaciones';

export default function Conversaciones() {
  const [conversaciones, setConversaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    const cargarConversaciones = async () => {
      try {
        // En producción, esto sería una llamada real a la API
        // const respuesta = await fetch('http://localhost:8080/api/conversaciones');
        // const datos = await respuesta.json();
        
        // Datos de ejemplo para desarrollo
        const datosEjemplo = [
          {
            id: 1,
            idChatwoot: 123,
            numeroTelefono: '+573001234567',
            nombreContacto: 'Juan Pérez',
            estado: 'ABIERTA',
            fechaCreacion: '2025-05-15T10:25:00',
            fechaActualizacion: '2025-05-16T10:30:00',
            agente: {
              id: 1,
              idChatwoot: 101,
              nombre: "Ana Martínez",
              email: "ana@ejemplo.com",
              avatar: "AM",
              disponible: true
            },
            etiquetas: [
              { id: 2, idChatwoot: 202, nombre: "Soporte Técnico", color: "#33A8FF" }
            ],
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
            fechaCreacion: '2025-05-15T09:00:00',
            fechaActualizacion: '2025-05-16T09:15:00',
            agente: {
              id: 2,
              idChatwoot: 102,
              nombre: "Carlos Sánchez",
              email: "carlos@ejemplo.com",
              avatar: "CS",
              disponible: true
            },
            etiquetas: [
              { id: 1, idChatwoot: 201, nombre: "Urgente", color: "#FF5733" },
              { id: 3, idChatwoot: 203, nombre: "Ventas", color: "#33FF57" }
            ],
            mensajes: [
              {
                id: 201,
                contenido: 'Tengo un problema con mi pedido #12345',
                direccion: 'ENTRANTE',
                fechaEnvio: '2025-05-16T09:10:00'
              }
            ]
          },
          {
            id: 3,
            idChatwoot: 125,
            numeroTelefono: '+573007654321',
            nombreContacto: 'Pedro González',
            estado: 'RESUELTA',
            fechaCreacion: '2025-05-15T15:30:00',
            fechaActualizacion: '2025-05-15T16:00:00',
            agente: {
              id: 3,
              idChatwoot: 103,
              nombre: "Laura Gómez",
              email: "laura@ejemplo.com",
              avatar: "LG",
              disponible: false
            },
            etiquetas: [],
            mensajes: [
              {
                id: 301,
                contenido: '¿Cuáles son sus horarios de atención?',
                direccion: 'ENTRANTE',
                fechaEnvio: '2025-05-15T15:30:00'
              },
              {
                id: 302,
                contenido: 'Nuestro horario es de lunes a viernes de 8am a 6pm, y sábados de 9am a 1pm.',
                direccion: 'SALIENTE',
                fechaEnvio: '2025-05-15T15:35:00'
              },
              {
                id: 303,
                contenido: 'Gracias por la información',
                direccion: 'ENTRANTE',
                fechaEnvio: '2025-05-15T15:40:00'
              }
            ]
          }
        ];
        
        setConversaciones(datosEjemplo);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar conversaciones:', error);
        setCargando(false);
      }
    };

    cargarConversaciones();
  }, []);

  return (
    <>
      <Head>
        <title>Conversaciones - Chatwoot Sanipatin</title>
        <meta name="description" content="Gestión de conversaciones para la integración de Chatwoot con WhatsApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gris-900">Conversaciones</h1>
          
          <button className="inline-flex items-center px-4 py-2 bg-primario text-white rounded-md hover:bg-primario-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario transition-colors">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Conversación
          </button>
        </div>
        
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
          </div>
        ) : (
          <div className="tarjeta">
            <PanelConversaciones conversaciones={conversaciones} />
          </div>
        )}
      </div>
    </>
  );
}
