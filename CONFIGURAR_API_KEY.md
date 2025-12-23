# 🔑 Configuración Rápida de API Key

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Obtener API Key de OpenAI
1. Ve a: https://platform.openai.com/api-keys
2. Inicia sesión (o crea cuenta gratis)
3. Click en **"Create new secret key"**
4. **Copia la key** (solo se muestra una vez)

### 2️⃣ Agregar en Netlify
1. Ve a: https://app.netlify.com
2. Selecciona tu sitio **TecFix**
3. Menú lateral → **Site settings**
4. Menú lateral → **Environment variables**
5. Click **"Add a variable"**
6. Completa:
   ```
   Key: OPENAI_API_KEY
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
3. Escribe: "Hola"
4. ¡Debería funcionar! 🎉

---

## ⚠️ Problemas Comunes

### "La API key no está configurada"
- ✅ Verifica que agregaste `OPENAI_API_KEY` en Netlify
- ✅ **Redespliega** después de agregarla (paso 3)
- ✅ Espera 1-2 minutos después del despliegue

### "Error al comunicarse con OpenAI"
- ✅ Verifica que tu API key sea válida
- ✅ Verifica que tengas créditos en OpenAI
- ✅ Ve a: https://platform.openai.com/account/billing

### La función no aparece en Netlify
- ✅ Verifica que el archivo esté en: `netlify/functions/chat.js`
- ✅ Haz push de todos los archivos al repositorio
- ✅ Redespliega el sitio

---

## 💰 Costos de OpenAI

- **$5 de crédito gratis** al registrarte
- Después: ~$0.0015-0.002 por 1K tokens
- Una conversación típica: $0.01 - $0.05

---

## ✅ Checklist Final

- [ ] API key creada en OpenAI
- [ ] Variable `OPENAI_API_KEY` agregada en Netlify
- [ ] Sitio redesplegado después de agregar la variable
- [ ] Esperado 1-2 minutos después del despliegue
- [ ] Probado el chat y funciona

---

**¿Problemas?** Revisa `TROUBLESHOOTING.md` para más ayuda.

