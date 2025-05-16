import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reportes de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return (
        <div className="min-h-screen flex items-center justify-center bg-gris-100">
          <div className="tarjeta p-8 max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gris-900 mb-4">Algo salió mal</h1>
            <p className="text-gris-600 mb-6">
              La aplicación ha encontrado un error inesperado. Por favor, intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primario text-white py-2 px-4 rounded-md hover:bg-primario-dark transition-colors inline-block"
            >
              Recargar aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
