# 🤖 Configuración del Chat con OpenAI

Este documento explica cómo configurar el chat inteligente de TecFix usando OpenAI y Netlify.

## 📋 Requisitos Previos

1. Una cuenta en [OpenAI](https://platform.openai.com/)
2. Una cuenta en [Netlify](https://www.netlify.com/)
3. Tu sitio web desplegado en Netlify

## 🚀 Pasos de Configuración

### Paso 1: Obtener tu API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Inicia sesión o crea una cuenta
3. Ve a **API Keys** en el menú lateral
4. Haz clic en **"Create new secret key"**
5. Copia la API key (solo se mostrará una vez, guárdala bien)
6. ⚠️ **Importante**: OpenAI ofrece créditos gratuitos al registrarte, pero después cobra por uso

### Paso 2: Configurar la API Key en Netlify

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio (TecFix)
3. Ve a **Site settings** (Configuración del sitio)
4. En el menú lateral, busca **Environment variables** (Variables de entorno)
5. Haz clic en **"Add a variable"**
6. Configura:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Pega tu API key de OpenAI
   - **Scopes**: Selecciona "All scopes" o "Production, Deploy previews, Branch deploys"
7. Haz clic en **"Save"**

### Paso 3: Redesplegar tu sitio

1. Después de agregar la variable de entorno, necesitas redeplegar:
   - Opción A: Ve a **Deploys** y haz clic en **"Trigger deploy"** > **"Clear cache and deploy site"**
   - Opción B: Haz un pequeño cambio en tu código y haz push a tu repositorio

### Paso 4: Verificar que funciona

1. Abre tu sitio web en el navegador
2. Haz clic en el botón flotante del chat (💬)
3. Escribe un mensaje de prueba
4. Deberías recibir una respuesta del asistente

## 🔧 Estructura de Archivos

```
tecfix-web/
├── index.html          # HTML principal con el widget de chat
├── styles.css          # Estilos del chat
├── chat.js             # Lógica del chat (frontend)
├── netlify/
│   └── functions/
│       └── chat.js     # Función serverless para OpenAI
└── netlify.toml        # Configuración de Netlify
```

## 💡 Notas Importantes

### Costos de OpenAI

- OpenAI ofrece **$5 de crédito gratuito** al registrarte
- Después, el modelo `gpt-3.5-turbo` cuesta aproximadamente:
  - **$0.0015 por 1K tokens de entrada**
  - **$0.002 por 1K tokens de salida**
- Un token ≈ 4 caracteres
- Una conversación típica puede costar entre $0.01 - $0.05

### Límites y Configuración

- El chat está configurado para usar `gpt-3.5-turbo` (más económico)
- Máximo de tokens por respuesta: 500
- Se mantiene el contexto de los últimos 10 mensajes
- Puedes ajustar estos valores en `netlify/functions/chat.js`

### Seguridad

- ✅ La API key está segura en Netlify (variables de entorno)
- ✅ No se expone en el código del frontend
- ✅ Las funciones serverless de Netlify son seguras

### Solución de Problemas

**Error: "OpenAI API key no configurada"**
- Verifica que agregaste la variable `OPENAI_API_KEY` en Netlify
- Asegúrate de redeplegar después de agregar la variable

**Error: "Error al comunicarse con OpenAI"**
- Verifica que tu API key sea válida
- Revisa que tengas créditos disponibles en OpenAI
- Revisa los logs en Netlify Functions para más detalles

**El chat no aparece**
- Verifica que `chat.js` esté cargado en el HTML
- Abre la consola del navegador (F12) para ver errores
- Verifica que los archivos estén desplegados correctamente

## 🎨 Personalización

### Cambiar el modelo de OpenAI

En `netlify/functions/chat.js`, línea ~45, cambia:
```javascript
model: 'gpt-3.5-turbo', // Cambia a 'gpt-4' para mejor calidad (más caro)
```

### Ajustar el prompt del sistema

En `netlify/functions/chat.js`, línea ~30, modifica el mensaje del sistema para cambiar la personalidad del asistente.

### Cambiar el diseño

Los estilos del chat están en `styles.css`, busca la sección `/* Chat Widget */`.

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs de Netlify Functions en el dashboard
2. La consola del navegador (F12)
3. El estado de tu cuenta de OpenAI

---

¡Listo! Tu chat inteligente debería estar funcionando. 🎉

