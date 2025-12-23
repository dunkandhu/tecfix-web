# 🔧 Solución de Problemas del Chat

## ❌ Error: "Lo siento, hubo un error al procesar tu mensaje"

Este error puede tener varias causas. Sigue estos pasos para diagnosticarlo:

### 1. Verificar que la API Key esté configurada

**En Netlify:**
1. Ve a tu dashboard → Tu sitio → **Site settings**
2. Busca **Environment variables**
3. Verifica que exista `OPENAI_API_KEY` con tu key de OpenAI
4. Si no existe, créala y **redespliega** el sitio

### 2. Verificar los logs de Netlify Functions

**Para ver los logs:**
1. En Netlify, ve a **Functions** en el menú lateral
2. Busca la función `chat`
3. Haz clic en ella para ver los logs
4. Busca errores como:
   - `OPENAI_API_KEY no está configurada`
   - `Error de OpenAI: ...`
   - Errores de red o parseo

### 3. Verificar la consola del navegador

**Abre la consola del navegador (F12):**
1. Ve a la pestaña **Console**
2. Intenta enviar un mensaje en el chat
3. Busca errores en rojo que te indiquen qué está fallando

**Errores comunes:**
- `Failed to fetch` → La función no está desplegada o la URL es incorrecta
- `404 Not Found` → La función no existe en Netlify
- `500 Internal Server Error` → Error en la función (revisa logs de Netlify)

### 4. Verificar que la función esté desplegada

**Estructura de archivos necesaria:**
```
tecfix-web/
└── netlify/
    └── functions/
        └── chat.js
```

**Verificar en Netlify:**
1. Ve a **Functions** en tu dashboard
2. Deberías ver `chat` listada
3. Si no aparece, verifica que los archivos estén en la ruta correcta

### 5. Verificar la API Key de OpenAI

**En OpenAI Platform:**
1. Ve a https://platform.openai.com/api-keys
2. Verifica que tu API key esté activa
3. Verifica que tengas créditos disponibles
4. Si no tienes créditos, agrega fondos a tu cuenta

### 6. Probar la función manualmente

**Usando curl o Postman:**
```bash
curl -X POST https://tu-sitio.netlify.app/.netlify/functions/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola", "conversationHistory": []}'
```

**Respuesta esperada:**
```json
{
  "response": "¡Hola! ¿En qué puedo ayudarte?"
}
```

**Si obtienes error:**
- Revisa los logs de Netlify Functions
- Verifica que la API key esté configurada

## 🔍 Errores Específicos y Soluciones

### Error: "OpenAI API key no configurada"

**Solución:**
1. Ve a Netlify → Site settings → Environment variables
2. Agrega `OPENAI_API_KEY` con tu key de OpenAI
3. **IMPORTANTE:** Redespliega el sitio después de agregar la variable

### Error: "Failed to fetch" o "NetworkError"

**Causas posibles:**
- La función no está desplegada
- Problema de CORS (ya está solucionado en el código)
- La URL es incorrecta

**Solución:**
1. Verifica que `netlify/functions/chat.js` exista
2. Redespliega el sitio completo
3. Espera unos minutos a que Netlify procese la función

### Error: "Error al comunicarse con OpenAI"

**Causas posibles:**
- API key inválida o expirada
- Sin créditos en OpenAI
- Problema de red desde Netlify

**Solución:**
1. Verifica tu API key en https://platform.openai.com/api-keys
2. Verifica tus créditos en https://platform.openai.com/account/billing
3. Prueba crear una nueva API key

### Error: 404 Not Found

**Causa:**
La función no está siendo detectada por Netlify

**Solución:**
1. Verifica la estructura de carpetas: `netlify/functions/chat.js`
2. Verifica que el archivo tenga el formato correcto (exports.handler)
3. Redespliega el sitio
4. Si usas un monorepo, verifica la configuración en `netlify.toml`

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] La API key `OPENAI_API_KEY` está configurada en Netlify
- [ ] El sitio fue redesplegado después de agregar la variable
- [ ] La función `chat` aparece en Netlify Functions
- [ ] Tienes créditos disponibles en OpenAI
- [ ] La estructura de carpetas es correcta (`netlify/functions/chat.js`)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs de Netlify Functions

## 🆘 Si nada funciona

1. **Revisa los logs de Netlify Functions** - Ahí verás el error exacto
2. **Prueba la función manualmente** con curl o Postman
3. **Verifica que todos los archivos estén en el repositorio**
4. **Intenta crear una nueva API key** en OpenAI
5. **Redespliega desde cero** (Clear cache and deploy)

## 📝 Información para Debug

Si necesitas ayuda, proporciona:
- El error exacto de la consola del navegador
- Los logs de Netlify Functions
- La estructura de tus archivos
- Si la función aparece en Netlify Functions

---

**Nota:** Los errores ahora muestran mensajes más específicos. Revisa el mensaje de error en el chat para obtener más información sobre qué está fallando.

