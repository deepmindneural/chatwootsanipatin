import React from 'react';

function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gris-100">
      <div className="tarjeta p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gris-900 mb-4">
          {statusCode
            ? `Error ${statusCode}`
            : 'Error en el cliente'}
        </h1>
        <p className="text-gris-600 mb-6">
          {statusCode
            ? `Ocurrió un error ${statusCode} en el servidor.`
            : 'Ocurrió un error en el navegador.'}
        </p>
        <a
          href="/"
          className="bg-primario text-white py-2 px-4 rounded-md hover:bg-primario-dark transition-colors inline-block"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
