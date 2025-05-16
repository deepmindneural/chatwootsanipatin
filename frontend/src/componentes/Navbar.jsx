import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar({ menuMovilAbierto, setMenuMovilAbierto }) {
  const [usuarioMenuAbierto, setUsuarioMenuAbierto] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef(null);
  
  // Cerrar el menú de usuario cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUsuarioMenuAbierto(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cerrar el menú de usuario al cambiar de ruta
  useEffect(() => {
    const handleRouteChange = () => {
      setUsuarioMenuAbierto(false);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <nav className="bg-primario shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {menuMovilAbierto ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                Chatwoot Sanipatin
              </Link>
            </div>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Indicador de usuario actual */}
            <div className="text-white hidden sm:block mr-3">
              <span className="text-sm font-medium">Administrador</span>
            </div>
            
            {/* Botón de notificaciones */}
            <button
              type="button"
              className="bg-primario-dark p-1 rounded-full text-white hover:bg-primario-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primario-dark focus:ring-white"
            >
              <span className="sr-only">Ver notificaciones</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-primario"></span>
            </button>

            {/* Menú de perfil */}
            <div className="ml-3 relative" ref={userMenuRef}>
              <div>
                <button
                  onClick={() => setUsuarioMenuAbierto(!usuarioMenuAbierto)}
                  className="bg-primario-dark flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primario-dark focus:ring-white"
                  id="user-menu-button"
                  aria-expanded={usuarioMenuAbierto}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="h-8 w-8 rounded-full bg-primario-dark text-white flex items-center justify-center hover:bg-primario-light transition-colors">
                    <span className="font-medium">AP</span>
                  </div>
                </button>
              </div>
              
              {usuarioMenuAbierto && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link 
                    href="/perfil" 
                    className="block px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" 
                    role="menuitem"
                  >
                    Tu Perfil
                  </Link>
                  <Link 
                    href="/ajustes" 
                    className="block px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" 
                    role="menuitem"
                  >
                    Configuración
                  </Link>
                  <a href="#" className="block px-4 py-2 text-sm text-gris-700 hover:bg-gris-100" role="menuitem">
                    Cerrar Sesión
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
