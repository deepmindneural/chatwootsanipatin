// Simulador de Backend para la integración de Chatwoot
const http = require('http');

// Función para parsear URL y parámetros
const parseURL = (url) => {
  // Extraer query string si existe
  const [path, queryString] = url.split('?');
  const query = {};
  
  if (queryString) {
    const params = queryString.split('&');
    params.forEach(param => {
      const [key, value] = param.split('=');
      query[key] = value;
    });
  }
  
  // Extraer parámetros de ruta
  const pathSegments = path.split('/');
  const pathParams = {};
  
  // Detectar IDs en la ruta (/api/algo/:id/...)
  const idPattern = /^\d+$/;
  pathSegments.forEach((segment, index) => {
    if (idPattern.test(segment)) {
      pathParams.id = segment;
    }
  });
  
  return { path, query, pathParams };
};

// Datos de muestra - Agentes
const agentes = [
  { id: 1, idChatwoot: 101, nombre: "Ana Martínez", email: "ana@ejemplo.com", avatar: "AM", disponible: true },
  { id: 2, idChatwoot: 102, nombre: "Carlos Sánchez", email: "carlos@ejemplo.com", avatar: "CS", disponible: true },
  { id: 3, idChatwoot: 103, nombre: "Laura Gómez", email: "laura@ejemplo.com", avatar: "LG", disponible: false },
];

// Datos de muestra - Etiquetas
const etiquetas = [
  { id: 1, idChatwoot: 201, nombre: "Urgente", color: "#FF5733" },
  { id: 2, idChatwoot: 202, nombre: "Soporte Técnico", color: "#33A8FF" },
  { id: 3, idChatwoot: 203, nombre: "Ventas", color: "#33FF57" },
];

// Datos de muestra - Conversaciones
const conversaciones = [
  {
    id: 1,
    idChatwoot: 123,
    numeroTelefono: '+573001234567',
    nombreContacto: 'Juan Pérez',
    estado: 'ABIERTA',
    fechaCreacion: '2025-05-16T09:25:00',
    fechaActualizacion: '2025-05-16T10:30:00',
    agente: agentes[0],
    etiquetas: [etiquetas[1]],
    mensajes: [
      {
        id: 101,
        contenido: 'Hola, necesito información sobre sus servicios',
        tipo: 'TEXTO',
        direccion: 'ENTRANTE',
        fechaEnvio: '2025-05-16T10:25:00',
        leido: true
      },
      {
        id: 102,
        contenido: '¡Claro! Estamos para ayudarte. ¿Qué tipo de información necesitas?',
        tipo: 'TEXTO',
        direccion: 'SALIENTE',
        fechaEnvio: '2025-05-16T10:30:00',
        leido: true
      }
    ]
  },
  {
    id: 2,
    idChatwoot: 124,
    numeroTelefono: '+573009876543',
    nombreContacto: 'María López',
    estado: 'PENDIENTE',
    fechaCreacion: '2025-05-16T09:10:00',
    fechaActualizacion: '2025-05-16T09:15:00',
    agente: agentes[1],
    etiquetas: [etiquetas[0], etiquetas[2]],
    mensajes: [
      {
        id: 201,
        contenido: 'Tengo un problema con mi pedido #12345',
        tipo: 'TEXTO',
        direccion: 'ENTRANTE',
        fechaEnvio: '2025-05-16T09:10:00',
        leido: true
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
    agente: agentes[2],
    etiquetas: [],
    mensajes: [
      {
        id: 301,
        contenido: '¿Cuáles son sus horarios de atención?',
        tipo: 'TEXTO',
        direccion: 'ENTRANTE',
        fechaEnvio: '2025-05-15T15:30:00',
        leido: true
      },
      {
        id: 302,
        contenido: 'Nuestro horario es de lunes a viernes de 8am a 6pm, y sábados de 9am a 1pm.',
        tipo: 'TEXTO',
        direccion: 'SALIENTE',
        fechaEnvio: '2025-05-15T15:35:00',
        leido: true
      },
      {
        id: 303,
        contenido: 'Gracias por la información',
        tipo: 'TEXTO',
        direccion: 'ENTRANTE',
        fechaEnvio: '2025-05-15T15:40:00',
        leido: true
      }
    ]
  }
];

// Datos de estadísticas simuladas
const estadisticas = {
  conversacionesNuevas: 28,
  mensajesRecibidos: 156,
  tiempoRespuestaPromedio: 4.2,
  tasaResolucion: 87,
  calidadServicio: 92,
  graficos: {
    conversacionesPorDia: {
      labels: ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May'],
      datos: [12, 19, 13, 15, 20, 18, 15]
    },
    mensajesPorCanal: {
      labels: ['WhatsApp', 'Facebook', 'Instagram', 'Web', 'Email'],
      datos: [156, 84, 62, 45, 32]
    },
    estadoConversaciones: {
      labels: ['Abiertas', 'Pendientes', 'Resueltas'],
      datos: [25, 15, 60]
    }
  }
};

// Datos de configuración
const configuracion = {
  chatwoot: {
    url: "https://app.chatwoot.com",
    apiKey: "tu_api_key_chatwoot",
    cuentaId: "1",
    webhookToken: "token_secreto_webhook"
  },
  whatsapp: {
    proveedor: "360dialog",
    apiKey: "tu_api_key_whatsapp",
    numeroTelefono: "+573001234567"
  }
};

// Crear servidor HTTP
const servidor = http.createServer((req, res) => {
  // Log para debug
  console.log(`${req.method} ${req.url}`);
  
  // Parsear la URL
  const { path } = parseURL(req.url);
  
  // Configurar cabeceras CORS para permitir solicitudes del frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Configurar respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Rutas API - versión mejorada con mejor manejo de rutas
  try {
    // Ruta: /api/conversaciones (GET - Listar todas)
    if (path === '/api/conversaciones' && req.method === 'GET') {
      console.log('Enviando lista de conversaciones');
      res.writeHead(200);
      res.end(JSON.stringify(conversaciones));
      return;
    }
    
    // Ruta: /api/conversaciones/:id (GET - Obtener una conversación)
    const conversacionDetailMatch = path.match(/\/api\/conversaciones\/(\d+)$/);
    if (conversacionDetailMatch && req.method === 'GET') {
      const id = parseInt(conversacionDetailMatch[1]);
      const conversacion = conversaciones.find(c => c.id === id || c.idChatwoot === id);
      
      if (conversacion) {
        res.writeHead(200);
        res.end(JSON.stringify(conversacion));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Conversación no encontrada' }));
      }
      return;
    }
    
    // Ruta: /api/conversaciones/:id/mensajes (GET - Obtener mensajes)
    const mensajesMatch = path.match(/\/api\/conversaciones\/(\d+)\/mensajes$/);
    if (mensajesMatch && req.method === 'GET') {
      const id = parseInt(mensajesMatch[1]);
      const conversacion = conversaciones.find(c => c.id === id || c.idChatwoot === id);
      
      if (conversacion) {
        res.writeHead(200);
        res.end(JSON.stringify(conversacion.mensajes || []));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Conversación no encontrada' }));
      }
      return;
    }
    
    // Ruta: /api/conversaciones/:id/mensajes (POST - Enviar mensaje)
    if (mensajesMatch && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', () => {
        try {
          const datos = JSON.parse(body);
          const id = parseInt(mensajesMatch[1]);
          const conversacion = conversaciones.find(c => c.id === id || c.idChatwoot === id);
          
          if (!conversacion) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Conversación no encontrada' }));
            return;
          }
          
          const nuevoMensaje = {
            id: Math.floor(Math.random() * 1000) + 500,
            idChatwoot: Math.floor(Math.random() * 1000) + 500,
            contenido: datos.contenido,
            tipo: 'TEXTO',
            direccion: 'SALIENTE',
            fechaEnvio: new Date().toISOString(),
            leido: true
          };
          
          // Añadir mensaje a la conversación
          if (!conversacion.mensajes) conversacion.mensajes = [];
          conversacion.mensajes.push(nuevoMensaje);
          conversacion.fechaActualizacion = new Date().toISOString();
          
          res.writeHead(200);
          res.end(JSON.stringify(nuevoMensaje));
        } catch (error) {
          console.error('Error procesando datos:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
      return;
    }
    
    // Ruta: /api/conversaciones (POST - Crear conversación)
    if (path === '/api/conversaciones' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', () => {
        try {
          const datos = JSON.parse(body);
          const nuevaConversacion = {
            id: conversaciones.length + 1,
            idChatwoot: 126 + conversaciones.length,
            numeroTelefono: datos.numeroTelefono || '+573005555555',
            nombreContacto: datos.nombreContacto || 'Nuevo Contacto',
            estado: 'ABIERTA',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            agente: null,
            etiquetas: [],
            mensajes: []
          };
          
          conversaciones.push(nuevaConversacion);
          res.writeHead(200);
          res.end(JSON.stringify(nuevaConversacion));
        } catch (error) {
          console.error('Error procesando datos:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
      return;
    }
    
    // Ruta: /api/whatsapp/enviar (POST - Enviar mensaje WhatsApp)
    if (path === '/api/whatsapp/enviar' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', () => {
        try {
          const datos = JSON.parse(body);
          const mensajeEnviado = {
            id: Math.floor(Math.random() * 1000) + 700,
            idChatwoot: Math.floor(Math.random() * 1000) + 700,
            contenido: datos.contenido,
            tipo: 'TEXTO',
            direccion: 'SALIENTE',
            fechaEnvio: new Date().toISOString(),
            leido: true,
            idExterno: `whatsapp_${Date.now()}`
          };
          
          // Buscar o crear conversación para este número
          let conversacion = conversaciones.find(c => c.numeroTelefono === datos.numeroDestino);
          
          if (!conversacion) {
            // Crear nueva conversación
            conversacion = {
              id: conversaciones.length + 1,
              idChatwoot: 126 + conversaciones.length,
              numeroTelefono: datos.numeroDestino,
              nombreContacto: `Usuario ${datos.numeroDestino}`,
              estado: 'ABIERTA',
              fechaCreacion: new Date().toISOString(),
              fechaActualizacion: new Date().toISOString(),
              agente: agentes[0], // Asignar primer agente por defecto
              etiquetas: [],
              mensajes: [mensajeEnviado]
            };
            
            conversaciones.push(conversacion);
          } else {
            // Añadir mensaje a conversación existente
            if (!conversacion.mensajes) conversacion.mensajes = [];
            conversacion.mensajes.push(mensajeEnviado);
            conversacion.fechaActualizacion = new Date().toISOString();
          }
          
          res.writeHead(200);
          res.end(JSON.stringify(mensajeEnviado));
        } catch (error) {
          console.error('Error procesando datos:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
      return;
    }
    
    // Ruta: /api/webhooks/chatwoot (POST - Recibir webhook de Chatwoot)
    if (path === '/api/webhooks/chatwoot' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', () => {
        try {
          console.log('Webhook de Chatwoot recibido');
          res.writeHead(200);
          res.end(JSON.stringify({ status: 'ok', message: 'Webhook procesado' }));
        } catch (error) {
          console.error('Error procesando webhook:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
      return;
    }
    
    // Ruta: /api/estadisticas (GET - Obtener estadísticas)
    if (path === '/api/estadisticas' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(estadisticas));
      return;
    }
    
    // Ruta: /api/agentes (GET - Listar agentes)
    if (path === '/api/agentes' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(agentes));
      return;
    }
    
    // Ruta: /api/etiquetas (GET - Listar etiquetas)
    if (path === '/api/etiquetas' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(etiquetas));
      return;
    }
    
    // Ruta: /api/configuracion (GET - Obtener configuración)
    if (path === '/api/configuracion' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(configuracion));
      return;
    }
    
    // Ruta: / (GET - Página principal)
    if ((path === '/' || path === '') && req.method === 'GET') {
      const htmlResponse = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Chatwoot - WhatsApp</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #00B3C4; /* Color turquesa/cyan */
      border-bottom: 2px solid #00B3C4;
      padding-bottom: 10px;
    }
    h2 {
      color: #00B3C4;
      margin-top: 20px;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 5px;
      border-radius: 3px;
      font-family: monospace;
    }
    .endpoint {
      margin-bottom: 15px;
    }
    .method {
      font-weight: bold;
      display: inline-block;
      width: 60px;
    }
    .path {
      font-family: monospace;
      color: #0066cc;
    }
    .description {
      color: #666;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <h1>API Simulada de Integración Chatwoot - WhatsApp</h1>
  
  <p>Esta API proporciona endpoints para simular la integración entre Chatwoot y WhatsApp.</p>
  
  <h2>Endpoints Disponibles</h2>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/conversaciones</span>
    <span class="description">Listar todas las conversaciones</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/conversaciones/:id</span>
    <span class="description">Obtener una conversación específica</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/conversaciones/:id/mensajes</span>
    <span class="description">Listar mensajes de una conversación</span>
  </div>
  
  <div class="endpoint">
    <span class="method">POST</span>
    <span class="path">/api/conversaciones/:id/mensajes</span>
    <span class="description">Enviar mensaje a una conversación</span>
  </div>
  
  <div class="endpoint">
    <span class="method">POST</span>
    <span class="path">/api/conversaciones</span>
    <span class="description">Crear nueva conversación</span>
  </div>
  
  <div class="endpoint">
    <span class="method">POST</span>
    <span class="path">/api/whatsapp/enviar</span>
    <span class="description">Enviar mensaje de WhatsApp</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/estadisticas</span>
    <span class="description">Obtener estadísticas</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/agentes</span>
    <span class="description">Listar agentes disponibles</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/etiquetas</span>
    <span class="description">Listar etiquetas disponibles</span>
  </div>
  
  <div class="endpoint">
    <span class="method">GET</span>
    <span class="path">/api/configuracion</span>
    <span class="description">Obtener configuración actual</span>
  </div>
  
  <div class="endpoint">
    <span class="method">POST</span>
    <span class="path">/api/configuracion</span>
    <span class="description">Actualizar configuración</span>
  </div>
  
  <h2>Cómo Usar</h2>
  
  <p>Puedes acceder a estos endpoints usando cualquier cliente HTTP como cURL, Postman o desde tu aplicación frontend.</p>
  
  <p>Ejemplo de uso con cURL:</p>
  <pre><code>curl http://localhost:8080/api/conversaciones</code></pre>
  
  <h2>Servidor de Prueba</h2>
  
  <p>Este es un simulador de backend para pruebas y desarrollo. No utilices este servidor en producción.</p>
</body>
</html>
`;
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlResponse);
      return;
    }
    
    // Ruta: /api/configuracion (POST - Actualizar configuración)
    if (path === '/api/configuracion' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      req.on('end', () => {
        try {
          const datos = JSON.parse(body);
          // Actualizar configuración
          Object.assign(configuracion, datos);
          
          res.writeHead(200);
          res.end(JSON.stringify({ status: 'ok', message: 'Configuración actualizada' }));
        } catch (error) {
          console.error('Error procesando datos:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
      });
      return;
    }
    
    // Ruta por defecto - No encontrada
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 'Ruta no encontrada', 
      path: path,
      method: req.method,
      availableRoutes: [
        'GET /api/conversaciones',
        'GET /api/conversaciones/:id',
        'GET /api/conversaciones/:id/mensajes',
        'POST /api/conversaciones/:id/mensajes',
        'POST /api/conversaciones',
        'POST /api/whatsapp/enviar',
        'GET /api/estadisticas',
        'GET /api/agentes',
        'GET /api/etiquetas',
        'GET /api/configuracion',
        'POST /api/configuracion'
      ]
    }));
    
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Error interno del servidor' }));
  }
});

// Puerto para el servidor
const PUERTO = 8080;

// Iniciar servidor
servidor.listen(PUERTO, () => {
  console.log(`Simulador de Backend ejecutándose en http://localhost:${PUERTO}`);
  console.log('Accede a la página principal para ver la documentación: http://localhost:' + PUERTO + '/');
  console.log('\nEndpoints disponibles:');
  console.log('- GET  /api/conversaciones                (Listar todas)');
  console.log('- GET  /api/conversaciones/:id            (Obtener una)');
  console.log('- GET  /api/conversaciones/:id/mensajes   (Listar mensajes)');
  console.log('- POST /api/conversaciones/:id/mensajes   (Enviar mensaje)');
  console.log('- POST /api/conversaciones                (Crear conversación)');
  console.log('- POST /api/whatsapp/enviar               (Enviar mensaje WhatsApp)');
  console.log('- POST /api/webhooks/chatwoot             (Webhook de Chatwoot)');
  console.log('- GET  /api/estadisticas                  (Obtener estadísticas)');
  console.log('- GET  /api/agentes                       (Listar agentes)');
  console.log('- GET  /api/etiquetas                     (Listar etiquetas)');
  console.log('- GET  /api/configuracion                 (Obtener configuración)');
  console.log('- POST /api/configuracion                 (Actualizar configuración)');
});
