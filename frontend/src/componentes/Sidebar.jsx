import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ menuMovilAbierto, setMenuMovilAbierto }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Control de pantallas responsivas
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Establecer estado inicial
    handleResize();

    // Agregar listener para redimensionar ventana
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú si se toca fuera en móvil
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event) => {
      const sidebarElement = document.getElementById('sidebar');
      if (sidebarElement && !sidebarElement.contains(event.target) && menuMovilAbierto) {
        setMenuMovilAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, menuMovilAbierto, setMenuMovilAbierto]);

  const navItems = [
    {
      nombre: 'Inicio',
      ruta: '/',
      icono: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      nombre: 'Conversaciones',
      ruta: '/conversaciones',
      icono: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      nombre: 'Contactos',
      ruta: '/contactos',
      icono: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      nombre: 'Estadísticas',
      ruta: '/estadisticas',
      icono: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      nombre: 'Ajustes',
      ruta: '/ajustes',
      icono: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Clases para la barra lateral en modo móvil o escritorio
  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-30 w-64 transform ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out h-full bg-white border-r border-gris-200 shadow-sm overflow-y-auto`
    : 'relative w-64 flex-shrink-0 h-full bg-white border-r border-gris-200 shadow-sm overflow-y-auto';

  return (
    <>
      {/* Overlay para móvil cuando el menú está abierto */}
      {isMobile && menuMovilAbierto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out"
          onClick={() => setMenuMovilAbierto(false)}
        />
      )}

      <aside id="sidebar" className={sidebarClasses}>
        <div className="sticky top-0 z-10 bg-white">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gris-200">
            <h2 className="text-xl font-bold text-primario">Chatwoot Sanipatin</h2>
            {isMobile && (
              <button 
                className="p-1 rounded-md text-gris-500 hover:text-primario"
                onClick={() => setMenuMovilAbierto(false)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <nav className="py-4">
          <ul>
            {navItems.map((item) => {
              const isActive = router.pathname === item.ruta || 
                 (item.ruta !== '/' && router.pathname.startsWith(item.ruta));
              
              return (
                <li key={item.nombre}>
                  <Link 
                    href={item.ruta}
                    className={`flex items-center px-4 py-3 text-gris-700 hover:bg-primario hover:bg-opacity-10 hover:text-primario transition-colors ${isActive ? 'bg-primario bg-opacity-10 text-primario font-medium' : ''}`}
                    onClick={() => isMobile && setMenuMovilAbierto(false)}
                  >
                    <span className="mr-3">{item.icono}</span>
                    <span>{item.nombre}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-6 mt-auto border-t border-gris-200">
          <h3 className="text-xs font-semibold text-gris-500 uppercase tracking-wider">CANALES CONECTADOS</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">WhatsApp Business</span>
            </li>
            <li className="flex items-center px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-sm">Facebook Messenger</span>
            </li>
            <li className="flex items-center px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-sm">Instagram Direct</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
