import '../estilos/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProveedorConversaciones } from '../contextos/ContextoConversaciones';
import Navbar from '../componentes/Navbar';
import Sidebar from '../componentes/Sidebar';
import ErrorBoundary from '../componentes/ErrorBoundary';

function MiAplicacion({ Component, pageProps }) {
  const router = useRouter();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [paginaCargada, setPaginaCargada] = useState(false);
  
  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuMovilAbierto(false);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  
  // Evitar parpadeo de contenido durante la hidratación
  useEffect(() => {
    setPaginaCargada(true);
  }, []);
  
  if (!paginaCargada) {
    return null; // Evita parpadeo durante la hidratación
  }
  
  // Rutas públicas que no requieren layout completo
  const rutasPublicas = ['/login', '/registro', '/recuperar-contrasena'];
  const esRutaPublica = rutasPublicas.includes(router.pathname);
  
  if (esRutaPublica) {
    return (
      <ErrorBoundary>
        <ProveedorConversaciones>
          <Component {...pageProps} />
        </ProveedorConversaciones>
      </ErrorBoundary>
    );
  }
  
  return (
    <ErrorBoundary>
      <ProveedorConversaciones>
        <div className="min-h-screen bg-gris-50">
          <Navbar menuMovilAbierto={menuMovilAbierto} setMenuMovilAbierto={setMenuMovilAbierto} />
          
          <div className="flex min-h-[calc(100vh-64px)]">
            <Sidebar menuMovilAbierto={menuMovilAbierto} setMenuMovilAbierto={setMenuMovilAbierto} />
            
            <main className="flex-1 p-4 sm:p-6 overflow-auto">
              <div className="contenedor mx-auto">
                <Component {...pageProps} />
              </div>
            </main>
          </div>
        </div>
      </ProveedorConversaciones>
    </ErrorBoundary>
  );
}

export default MiAplicacion;
