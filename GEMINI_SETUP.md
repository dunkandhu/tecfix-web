# 🤖 Configuración del Chat con Google Gemini (Gratis)

Este documento explica cómo configurar el chat inteligente de TecFix usando **Google Gemini en su capa gratuita**.

## 🎯 Ventajas de Google Gemini

- ✅ **100% Gratuito** - Sin necesidad de tarjeta de crédito
- ✅ **Generoso** - 60 solicitudes por minuto en la capa gratuita
- ✅ **Rápido** - Modelo gemini-1.5-flash optimizado para velocidad
- ✅ **Potente** - Respuestas de alta calidad

## 📋 Requisitos Previos

1. Una cuenta de Google (Gmail)
2. Una cuenta en [Netlify](https://www.netlify.com/)
3. Tu sitio web desplegado en Netlify

## 🚀 Pasos de Configuración

### Paso 1: Obtener tu API Key de Google Gemini (GRATIS)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Get API key"** o **"Create API key"**
4. Selecciona tu proyecto de Google Cloud (o crea uno nuevo)
5. **Copia la API key** que se genera
6. ⚠️ **Importante**: La key se muestra una vez, guárdala bien

**Nota**: No necesitas configurar facturación ni agregar tarjeta de crédito. La capa gratuita es suficiente.

### Paso 2: Configurar la API Key en Netlify

1. Ve a tu dashboard de Netlify: https://app.netlify.com
2. Selecciona tu sitio (TecFix)
3. Ve a **Site settings** (Configuración del sitio)
4. En el menú lateral, busca **Environment variables** (Variables de entorno)
5. Haz clic en **"Add a variable"**
6. Configura:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Pega tu API key de Google Gemini
   - **Scopes**: Selecciona "All scopes" o "Production, Deploy previews, Branch deploys"
7. Haz clic en **"Save"**

### Paso 3: Redesplegar tu sitio

1. Después de agregar la variable de entorno, **debes redesplegar**:
   - Ve a **Deploys** en el menú lateral
   - Haz clic en **"Trigger deploy"**
   - Selecciona **"Clear cache and deploy site"**
   - Espera 1-2 minutos a que termine el despliegue

### Paso 4: Verificar que funciona

1. Abre tu sitio web en el navegador
2. Haz clic en el botón flotante del chat (💬)
3. Escribe un mensaje de prueba: "Hola, ¿qué servicios ofrecen?"
4. Deberías recibir una respuesta del asistente de Gemini

## 🔧 Estructura de Archivos

```
tecfix-web/
├── index.html          # HTML principal con el widget de chat
├── styles.css          # Estilos del chat
├── chat.js             # Lógica del chat (frontend)
├── netlify/
│   └── functions/
│       └── chat.js     # Función serverless para Gemini
└── netlify.toml        # Configuración de Netlify
```

## 💡 Notas Importantes

### Límites de la Capa Gratuita

- **60 solicitudes por minuto** por API key
- **1,500 solicitudes por día** (más que suficiente para la mayoría de casos)
- Sin límite de tokens en la capa gratuita
- Modelo usado: `gemini-1.5-flash` (rápido y gratuito)

### Seguridad

- ✅ La API key está segura en Netlify (variables de entorno)
- ✅ No se expone en el código del frontend
- ✅ Las funciones serverless de Netlify son seguras

### Modelo Utilizado

El chat usa **`gemini-pro`** que es:
- Gratuito
- Estable y confiable
- Potente (buena calidad de respuestas)
- Disponible en la API v1beta
- Ideal para chatbots

Si quieres cambiar a otro modelo, edita `netlify/functions/chat.js` línea 121:
```javascript
const model = 'gemini-pro'; // Modelo gratuito y estable
```

## 🔍 Solución de Problemas

### Error: "Google Gemini API key no configurada"

**Solución:**
- Verifica que agregaste la variable `GEMINI_API_KEY` en Netlify
- Asegúrate de **redesplegar** después de agregar la variable
- Espera 1-2 minutos después del despliegue

### Error: "API key inválida"

**Solución:**
- Verifica que copiaste la API key completa
- Crea una nueva API key en Google AI Studio
- Actualiza la variable en Netlify y redespliega

### Error: "Cuota excedida"

**Solución:**
- Has excedido el límite de 60 solicitudes por minuto
- Espera 1 minuto y vuelve a intentar
- La cuota se reinicia automáticamente

### El chat no aparece

**Solución:**
- Verifica que `chat.js` esté cargado en el HTML
- Abre la consola del navegador (F12) para ver errores
- Verifica que los archivos estén desplegados correctamente

## 🎨 Personalización

### Cambiar el prompt del sistema

En `netlify/functions/chat.js`, línea 50, modifica el mensaje del sistema para cambiar la personalidad del asistente:

```javascript
parts: [{ text: 'Eres un asistente virtual amigable y profesional de TecFix...' }]
```

### Cambiar el modelo

En `netlify/functions/chat.js`, línea 121:
```javascript
const model = 'gemini-pro'; // Modelo gratuito y estable
```

**Nota**: Asegúrate de usar un modelo compatible con la versión v1beta de la API. `gemini-pro` es el modelo recomendado para la capa gratuita.

### Ajustar parámetros

En `netlify/functions/chat.js`, líneas 88-92, puedes ajustar:
- `temperature`: Creatividad (0.0 - 1.0)
- `maxOutputTokens`: Longitud máxima de respuesta
- `topK` y `topP`: Control de diversidad

## 📊 Comparación: Gemini vs OpenAI

| Característica | Google Gemini | OpenAI |
|---------------|---------------|---------|
| **Costo** | ✅ Gratis | ❌ De pago |
| **Tarjeta de crédito** | ❌ No requerida | ✅ Requerida |
| **Límite gratuito** | 60 req/min | $5 crédito inicial |
| **Velocidad** | ⚡ Muy rápido | 🐢 Más lento |
| **Calidad** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## ✅ Checklist Final

- [ ] API key creada en Google AI Studio
- [ ] Variable `GEMINI_API_KEY` agregada en Netlify
- [ ] Sitio redesplegado después de agregar la variable
- [ ] Esperado 1-2 minutos después del despliegue
- [ ] Probado el chat y funciona correctamente

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Netlify Functions en el dashboard
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que la API key esté activa en Google AI Studio
4. Asegúrate de haber redesplegado después de configurar la variable

---

¡Listo! Tu chat inteligente con Google Gemini debería estar funcionando. 🎉

**Ventaja**: A diferencia de OpenAI, Google Gemini es completamente gratuito y no requiere tarjeta de crédito.

