# 🔍 Solución: "Error al comunicarse con OpenAI"

Este error aparece cuando la API key está configurada, pero hay un problema al comunicarse con OpenAI.

## 🔎 Pasos para Diagnosticar

### 1. Revisar los Logs de Netlify Functions

**Esto es lo más importante para saber qué está fallando:**

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a **Functions** en el menú lateral
4. Haz clic en la función **chat**
5. Ve a la pestaña **Logs**
6. Busca los errores más recientes

**Busca mensajes como:**
- `Error de OpenAI: { ... }`
- `Respuesta de OpenAI - Status: 401` (API key inválida)
- `Respuesta de OpenAI - Status: 429` (Rate limit)
- `Respuesta de OpenAI - Status: 402` (Sin créditos)

### 2. Verificar tu API Key de OpenAI

1. Ve a: https://platform.openai.com/api-keys
2. Verifica que tu API key esté **activa**
3. Si está inactiva o expirada, crea una nueva
4. **Actualiza la variable en Netlify** con la nueva key
5. **Redespliega** el sitio

### 3. Verificar Créditos en OpenAI

**El problema más común es falta de créditos:**

1. Ve a: https://platform.openai.com/account/billing
2. Verifica que tengas **créditos disponibles**
3. Si no tienes créditos:
   - Haz clic en **"Add payment method"**
   - Agrega un método de pago
   - Agrega fondos (mínimo $5)

### 4. Verificar el Modelo

El código usa `gpt-3.5-turbo` que debería estar disponible. Si tienes problemas:

1. Verifica que el modelo esté disponible en tu cuenta
2. Algunas cuentas nuevas pueden tener restricciones
3. Prueba cambiando a `gpt-4` (más caro) si es necesario

## 🛠️ Soluciones por Tipo de Error

### Error 401: API Key Inválida
```
Solución:
1. Crea una nueva API key en OpenAI
2. Actualiza OPENAI_API_KEY en Netlify
3. Redespliega el sitio
```

### Error 402: Sin Créditos
```
Solución:
1. Ve a: https://platform.openai.com/account/billing
2. Agrega un método de pago
3. Agrega fondos a tu cuenta
```

### Error 429: Rate Limit
```
Solución:
1. Espera unos minutos
2. Reduce la frecuencia de mensajes
3. Considera usar un plan de pago en OpenAI
```

### Error 500: Error Interno
```
Solución:
1. Revisa los logs de Netlify para más detalles
2. Verifica que la estructura de la petición sea correcta
3. Intenta de nuevo en unos minutos
```

## ✅ Checklist de Verificación

- [ ] Revisé los logs de Netlify Functions
- [ ] Mi API key está activa en OpenAI
- [ ] Tengo créditos disponibles en OpenAI
- [ ] Actualicé la variable en Netlify después de cambiar la key
- [ ] Redesplegué el sitio después de cambios
- [ ] Esperé 1-2 minutos después del despliegue

## 🧪 Probar la API Key Directamente

Puedes probar tu API key directamente con curl:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY_AQUI" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hola"}],
    "max_tokens": 50
  }'
```

**Si funciona:** El problema está en Netlify Functions
**Si no funciona:** El problema está en tu API key o créditos

## 📝 Información para Soporte

Si nada funciona, proporciona:
1. El error exacto de los logs de Netlify Functions
2. El status code de la respuesta (401, 402, 429, etc.)
3. Si tienes créditos en OpenAI
4. Si la API key está activa

---

**Nota:** El código ahora muestra mensajes más específicos según el tipo de error. Revisa el mensaje exacto que aparece en el chat para más información.

