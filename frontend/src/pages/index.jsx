import { useState, useEffect } from 'react';
import Head from 'next/head';
import Dashboard from '../componentes/Dashboard';
import PanelConversaciones from '../componentes/PanelConversaciones';

export default function Inicio() {
  const [conversaciones, setConversaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

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
        <title>Panel de Control - Chatwoot Sanipatin</title>
        <meta name="description" content="Panel de control para la integración de Chatwoot con WhatsApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gris-900">Panel de Control</h1>
        </div>
        
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
          </div>
        ) : (
          <>
            <Dashboard datos={{}} />
            
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gris-900 mb-4">Conversaciones Recientes</h2>
              <div className="tarjeta">
                <PanelConversaciones conversaciones={conversaciones} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
