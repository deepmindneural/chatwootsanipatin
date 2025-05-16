# Guía de Integración Técnica - Chatwoot con WhatsApp

Esta documentación detalla el proceso completo de integración entre Chatwoot y WhatsApp Business, incluyendo la configuración del backend en Java y el frontend en React/Next.js.

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Configuración de Chatwoot](#configuración-de-chatwoot)
3. [Integración con WhatsApp](#integración-con-whatsapp)
4. [Backend Java](#backend-java)
5. [Frontend React/Next.js](#frontend-reactnextjs)
6. [Webhooks y Eventos](#webhooks-y-eventos)
7. [Solución de Problemas](#solución-de-problemas)

## Arquitectura del Sistema

La arquitectura de la integración se compone de los siguientes elementos:

```
[Cliente WhatsApp] <--> [API WhatsApp (360dialog/Twilio)] <--> [Chatwoot] <--> [Backend Java] <--> [Frontend React/Next.js]
```

- **WhatsApp Business API**: Gestionada a través de proveedores como 360dialog o Twilio.
- **Chatwoot**: Plataforma central para gestión de conversaciones.
- **Backend Java**: API REST desarrollada con Spring Boot para sincronizar datos entre Chatwoot y sistemas internos.
- **Frontend React/Next.js**: Interfaz personalizada para agentes y administradores.

## Configuración de Chatwoot

### Instalación

Chatwoot puede desplegarse de dos maneras:

1. **Cloud (SaaS)**: Utilizando la plataforma en [app.chatwoot.com](https://app.chatwoot.com)
2. **Self-hosted**:
   - Requisitos: PostgreSQL, Redis, Ruby on Rails
   - [Guía oficial de instalación](https://www.chatwoot.com/docs/self-hosted/deployment/install-with-docker)

### Configuración Inicial

1. Crear una cuenta y configurar el perfil de la organización
2. Crear agentes y asignar roles
3. Configurar bandeja de entrada para WhatsApp
4. Generar API Key (Ajustes > Perfil > API Keys)

## Integración con WhatsApp

### Opción 1: 360dialog (Recomendada)

1. Crear cuenta en [360dialog](https://www.360dialog.com/)
2. Verificar número de teléfono
3. Obtener las credenciales de la API
4. En Chatwoot, ir a Ajustes > Buzones > Añadir Buzón > WhatsApp
5. Seleccionar 360dialog como proveedor
6. Ingresar las credenciales de la API y número verificado

### Opción 2: Twilio

1. Crear cuenta en [Twilio](https://www.twilio.com/)
2. Activar la API de WhatsApp Business
3. Obtener SID y Token de autenticación
4. En Chatwoot, ir a Ajustes > Buzones > Añadir Buzón > WhatsApp
5. Seleccionar Twilio como proveedor
6. Ingresar SID, Token y número verificado

## Backend Java

### Configuración del Entorno

1. Requisitos:
   - Java 17+
   - Maven o Gradle
   - PostgreSQL
   - IDE (IntelliJ IDEA, Eclipse, etc.)

2. Configurar `application.properties`:
   ```properties
   # Configuración de Chatwoot
   chatwoot.url=https://app.chatwoot.com
   chatwoot.api.key=tu_api_key
   chatwoot.cuenta.id=1
   chatwoot.webhook.token=token_secreto

   # Configuración de WhatsApp
   whatsapp.proveedor=360dialog
   whatsapp.360dialog.api.key=tu_api_key_360dialog
   whatsapp.360dialog.numero.telefono=+573001234567
   ```

### Endpoints de API

#### Conversaciones

- `GET /api/conversaciones`: Obtener todas las conversaciones
- `POST /api/conversaciones`: Crear una nueva conversación
- `POST /api/conversaciones/{idConversacionChatwoot}/mensajes`: Enviar mensaje a una conversación

#### WhatsApp

- `POST /api/whatsapp/enviar`: Enviar mensaje directo por WhatsApp
- `POST /api/whatsapp/webhook`: Recibir eventos de WhatsApp
- `GET /api/whatsapp/webhook`: Verificación del webhook de WhatsApp

#### Webhooks

- `POST /api/webhooks/chatwoot`: Recibir eventos de Chatwoot

## Frontend React/Next.js

### Instalación y Configuración

1. Requisitos:
   - Node.js 18+
   - npm o yarn

2. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

3. Configurar variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Estructura de Componentes

- `pages/`: Rutas de la aplicación
- `componentes/`: Componentes reutilizables (Navbar, Sidebar, etc.)
- `contextos/`: Manejo de estado global
- `servicios/`: Comunicación con el backend

## Webhooks y Eventos

### Configurar Webhook en Chatwoot

1. En Chatwoot, ir a Ajustes > Aplicaciones > Webhook
2. Añadir URL del webhook: `https://tu-dominio.com/api/webhooks/chatwoot`
3. Seleccionar eventos:
   - Conversación creada
   - Mensaje creado
   - Conversación asignada
   - Conversación resuelta

### Configurar Webhook en WhatsApp (360dialog)

1. En panel de 360dialog, ir a Webhooks
2. Configurar URL: `https://tu-dominio.com/api/whatsapp/webhook`
3. Asegurar que la URL es accesible públicamente (puede requerir Ngrok para desarrollo local)

## Solución de Problemas

### Problemas Comunes

1. **Mensajes no envían o reciben**:
   - Verificar credenciales de API
   - Comprobar que los webhooks estén configurados correctamente
   - Revisar logs del sistema

2. **Errores de conexión**:
   - Asegurar que las URLs de los servicios estén correctas
   - Verificar firewall y permisos de red

3. **Mensajes duplicados**:
   - Implementar sistema de deduplicación basado en IDs de mensaje
   - Agregar verificación de mensajes ya procesados

### Soporte

Para consultas técnicas, contactar a soporte@tudominio.com
