# 🔑 Configuración Rápida de Google Gemini (5 minutos)

## ⚡ Pasos Rápidos

### 1️⃣ Obtener API Key de Google Gemini (GRATIS)

1. Ve a: https://aistudio.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Click en **"Get API key"** o **"Create API key"**
4. Selecciona o crea un proyecto de Google Cloud
5. **Copia la API key** (se muestra una vez)

**✅ No necesitas tarjeta de crédito - Es 100% gratis**

### 2️⃣ Agregar en Netlify

1. Ve a: https://app.netlify.com
2. Selecciona tu sitio **TecFix**
3. Menú lateral → **Site settings**
4. Menú lateral → **Environment variables**
5. Click **"Add a variable"**
6. Completa:
   ```
   Key: GEMINI_API_KEY
   Value: [Pega tu API key aquí]
   Scopes: All scopes
   ```
7. Click **"Save"**

### 3️⃣ Redesplegar (MUY IMPORTANTE)

1. Menú lateral → **Deploys**
2. Click **"Trigger deploy"**
3. Selecciona **"Clear cache and deploy site"**
4. Espera 1-2 minutos

### 4️⃣ Probar

1. Abre tu sitio web
2. Click en el botón del chat 💬
3. Escribe: "Hola, ¿qué servicios ofrecen?"
4. ¡Debería funcionar! 🎉

---

## ⚠️ Problemas Comunes

### "Google Gemini API key no configurada"
- ✅ Verifica que agregaste `GEMINI_API_KEY` en Netlify
- ✅ **Redespliega** después de agregarla (paso 3)
- ✅ Espera 1-2 minutos después del despliegue

### "API key inválida"
- ✅ Verifica que copiaste la key completa
- ✅ Crea una nueva key en Google AI Studio
- ✅ Actualiza la variable en Netlify y redespliega

### "Cuota excedida"
- ✅ Has excedido 60 solicitudes por minuto
- ✅ Espera 1 minuto y vuelve a intentar
- ✅ La cuota se reinicia automáticamente

---

## 💰 Costos

- **$0.00** - Completamente gratis
- **Sin tarjeta de crédito** requerida
- **60 solicitudes por minuto** en la capa gratuita
- **1,500 solicitudes por día** (más que suficiente)

---

## ✅ Checklist Final

- [ ] API key creada en Google AI Studio
- [ ] Variable `GEMINI_API_KEY` agregada en Netlify
- [ ] Sitio redesplegado después de agregar la variable
- [ ] Esperado 1-2 minutos después del despliegue
- [ ] Probado el chat y funciona

---

**¿Problemas?** Revisa `GEMINI_SETUP.md` para más ayuda.

**Ventaja**: A diferencia de OpenAI, Google Gemini es 100% gratis y no requiere tarjeta de crédito. 🎉

