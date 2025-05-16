import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('TODOS');
  
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        // En producción, esto sería una llamada real a la API
        // Simulamos un pequeño retraso para mostrar el estado de carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo para desarrollo
        const datosEjemplo = [
          {
            id: 1,
            idChatwoot: 501,
            nombre: 'Juan Pérez',
            numeroTelefono: '+573001234567',
            email: 'juan.perez@ejemplo.com',
            fechaCreacion: '2025-04-10T15:30:00',
            ultimaInteraccion: '2025-05-16T10:30:00',
            etiquetas: ['Cliente Frecuente', 'Soporte Técnico'],
            totalConversaciones: 5,
            estado: 'ACTIVO'
          },
          {
            id: 2,
            idChatwoot: 502,
            nombre: 'María López',
            numeroTelefono: '+573009876543',
            email: 'maria.lopez@ejemplo.com',
            fechaCreacion: '2025-03-22T11:45:00',
            ultimaInteraccion: '2025-05-16T09:15:00',
            etiquetas: ['Prospecto', 'Ventas'],
            totalConversaciones: 2,
            estado: 'ACTIVO'
          },
          {
            id: 3,
            idChatwoot: 503,
            nombre: 'Pedro González',
            numeroTelefono: '+573007654321',
            email: 'pedro.gonzalez@ejemplo.com',
            fechaCreacion: '2025-05-01T09:30:00',
            ultimaInteraccion: '2025-05-15T16:00:00',
            etiquetas: ['Cliente Nuevo'],
            totalConversaciones: 1,
            estado: 'ACTIVO'
          },
          {
            id: 4,
            idChatwoot: 504,
            nombre: 'Ana Rodríguez',
            numeroTelefono: '+573004567890',
            email: 'ana.rodriguez@ejemplo.com',
            fechaCreacion: '2025-02-15T14:20:00',
            ultimaInteraccion: '2025-05-10T13:45:00',
            etiquetas: ['Cliente Frecuente', 'Ventas', 'VIP'],
            totalConversaciones: 12,
            estado: 'ACTIVO'
          },
          {
            id: 5,
            idChatwoot: 505,
            nombre: 'Carlos Sánchez',
            numeroTelefono: '+573002345678',
            email: 'carlos.sanchez@ejemplo.com',
            fechaCreacion: '2025-01-05T10:15:00',
            ultimaInteraccion: '2025-04-30T11:30:00',
            etiquetas: ['Soporte Técnico'],
            totalConversaciones: 3,
            estado: 'INACTIVO'
          }
        ];
        
        setContactos(datosEjemplo);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar contactos:', error);
        setCargando(false);
      }
    };

    cargarContactos();
  }, []);

  // Filtrar contactos según la búsqueda
  const contactosFiltrados = contactos.filter(contacto => {
    const coincideBusqueda = 
      busqueda === '' ||
      contacto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      contacto.numeroTelefono.includes(busqueda) ||
      contacto.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEtiqueta = 
      filtroEtiqueta === 'TODOS' ||
      (contacto.etiquetas && contacto.etiquetas.some(etiqueta => 
        etiqueta.toLowerCase().includes(filtroEtiqueta.toLowerCase())
      ));
    
    return coincideBusqueda && coincideEtiqueta;
  });

  // Obtener todas las etiquetas únicas para el filtro
  const etiquetasUnicas = ['TODOS', ...new Set(
    contactos.flatMap(contacto => contacto.etiquetas || [])
  )];

  // Formatear fecha en formato legible
  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return "fecha desconocida";
    }
  };

  return (
    <>
      <Head>
        <title>Contactos - Chatwoot Sanipatin</title>
        <meta name="description" content="Gestión de contactos para la integración de Chatwoot con WhatsApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gris-900">Contactos</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gris-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar contacto..."
                className="pl-10 pr-3 py-2 w-full border border-gris-300 rounded-md focus:ring-primario focus:border-primario"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 border border-gris-300 rounded-md focus:ring-primario focus:border-primario"
              value={filtroEtiqueta}
              onChange={(e) => setFiltroEtiqueta(e.target.value)}
            >
              {etiquetasUnicas.map((etiqueta, index) => (
                <option key={index} value={etiqueta}>
                  {etiqueta === 'TODOS' ? 'Todas las etiquetas' : etiqueta}
                </option>
              ))}
            </select>
            
            <button className="inline-flex items-center px-4 py-2 bg-primario text-white rounded-md hover:bg-primario-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primario transition-colors">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Contacto
            </button>
          </div>
        </div>
        
        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primario"></div>
          </div>
        ) : (
          <div className="tarjeta overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gris-200">
                <thead className="bg-gris-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Contacto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Última Interacción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Etiquetas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Conversaciones</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gris-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gris-200">
                  {contactosFiltrados.length > 0 ? (
                    contactosFiltrados.map((contacto) => (
                      <tr key={contacto.id} className="hover:bg-gris-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primario bg-opacity-10 text-primario flex items-center justify-center font-medium">
                              {contacto.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gris-900">{contacto.nombre}</div>
                              <div className="text-sm text-gris-500">{contacto.numeroTelefono}</div>
                              <div className="text-sm text-gris-500">{contacto.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-500">
                          {formatearFecha(contacto.ultimaInteraccion)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {contacto.etiquetas.map((etiqueta, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primario bg-opacity-10 text-primario"
                              >
                                {etiqueta}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-500">
                          {contacto.totalConversaciones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contacto.estado === 'ACTIVO' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gris-100 text-gris-800'
                          }`}>
                            {contacto.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primario hover:text-primario-dark">
                              Editar
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gris-500">
                        No se encontraron contactos que coincidan con los criterios de búsqueda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
