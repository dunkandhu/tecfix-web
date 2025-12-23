// Netlify Function para integrar con Google Gemini (Capa Gratuita)

exports.handler = async (event, context) => {
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Solo permitir métodos POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Obtener la API key de las variables de entorno
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY no está configurada');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'Google Gemini API key no configurada. Por favor, configura GEMINI_API_KEY en Netlify.' 
        }),
      };
    }

    // Parsear el cuerpo de la petición
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      console.error('Error al parsear el body:', e);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Formato de petición inválido' }),
      };
    }

    const { message, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'El mensaje es requerido' }),
      };
    }

    // Preparar el historial de conversación para Gemini
    // Gemini usa un formato diferente: contents con parts
    const contents = [];
    
    // Agregar el contexto del sistema como primer mensaje
    contents.push({
      role: 'user',
      parts: [{ text: 'Eres un asistente virtual amigable y profesional de TecFix, una empresa de servicios tecnológicos. Ayudas a los usuarios con información sobre automatización, desarrollo web, pruebas de software y soluciones tecnológicas. Responde de manera clara, concisa y en español. Si no sabes algo, admítelo honestamente.' }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido. Estoy listo para ayudar a los usuarios de TecFix con información sobre servicios tecnológicos.' }]
    });

    // Agregar el historial de conversación
    conversationHistory.forEach(msg => {
      if (msg.role === 'user' || msg.role === 'model') {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    });

    // Agregar el mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Preparar la petición a Gemini
    // Usamos gemini-pro que es gratuito y está disponible en v1beta
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    console.log('Enviando petición a Gemini con', contents.length, 'mensajes');

    // Primero, intentar listar los modelos disponibles para esta cuenta
    let availableModels = [];
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
      const listResponse = await fetch(listUrl);
      
      if (listResponse.ok) {
        const listData = await listResponse.json();
        availableModels = (listData.models || [])
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));
        console.log('Modelos disponibles:', availableModels);
      }
    } catch (error) {
      console.log('No se pudo listar modelos, usando lista por defecto');
    }

    // Lista de modelos a intentar (prioridad: los que soportan generateContent)
    const modelsToTry = availableModels.length > 0 
      ? availableModels 
      : [
          'gemini-1.5-flash',
          'gemini-1.5-flash-8b',
          'gemini-pro',
          'gemini-1.5-pro',
          'gemini-2.0-flash-exp',
        ];

    let response;
    let lastError;
    let workingModel = null;
    
    // Intentar con cada modelo hasta que uno funcione
    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
        console.log(`Intentando con modelo: ${model}`);
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log(`Respuesta de Gemini (${model}) - Status:`, response.status);

        // Si la respuesta es exitosa, usar este modelo
        if (response.ok) {
          console.log(`✅ Modelo ${model} funcionó correctamente`);
          workingModel = model;
          break;
        }

        // Si es un error 404, el modelo no existe, probar el siguiente
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          lastError = errorData;
          console.log(`❌ Modelo ${model} no disponible (404), probando siguiente...`);
          continue;
        }

        // Si es otro error, detener y manejar
        const errorData = await response.json().catch(() => ({}));
        lastError = errorData;
        console.log(`❌ Error con modelo ${model}:`, errorData);
        break;
      } catch (error) {
        console.error(`Error al intentar con modelo ${model}:`, error);
        lastError = error;
        continue;
      }
    }

    // Si no se obtuvo respuesta exitosa de ningún modelo
    if (!response || !response.ok || !workingModel) {
      const errorData = await response?.json().catch(() => lastError || {});
      console.error('❌ Error de Gemini - ningún modelo funcionó. Último error:', errorData);
      console.error('Modelos intentados:', modelsToTry);
      
      return {
        statusCode: response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'No se pudo encontrar un modelo disponible',
          userMessage: '⚠️ Lo siento, no se pudo conectar con el asistente. Por favor, contáctanos directamente por WhatsApp usando el botón de contacto.',
          details: {
            ...errorData,
            modelsAttempted: modelsToTry,
            suggestion: 'Verifica que tu API key tenga acceso a modelos gratuitos en Google AI Studio'
          }
        }),
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de Gemini:', errorData);
      
      // Mensajes de error más específicos según el tipo
      let errorMessage = 'Error al comunicarse con Google Gemini';
      let userMessage = 'Error al comunicarse con Google Gemini. Por favor, intenta de nuevo.';
      
      if (errorData.error) {
        const geminiError = errorData.error;
        
        // Error de autenticación
        if (geminiError.status === 'UNAUTHENTICATED' || geminiError.message?.includes('API key')) {
          errorMessage = 'API key inválida o expirada';
          userMessage = '⚠️ La API key de Google Gemini no es válida. Por favor, verifica tu API key en Netlify.';
        }
        // Error de cuota
        else if (geminiError.status === 'RESOURCE_EXHAUSTED' || geminiError.message?.includes('quota')) {
          errorMessage = 'Cuota excedida';
          userMessage = '⚠️ Has excedido la cuota gratuita de Gemini. Por favor, espera un momento o verifica tu cuenta en Google AI Studio.';
        }
        // Error de rate limit
        else if (geminiError.status === 'RESOURCE_EXHAUSTED') {
          errorMessage = 'Límite de solicitudes excedido';
          userMessage = '⚠️ Has excedido el límite de solicitudes. Por favor, espera un momento e intenta de nuevo.';
        }
        // Otros errores
        else {
          errorMessage = geminiError.message || errorMessage;
          userMessage = `⚠️ Error: ${geminiError.message || 'Error desconocido'}. Revisa los logs de Netlify para más detalles.`;
        }
      }
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: errorMessage,
          userMessage: userMessage,
          details: errorData 
        }),
      };
    }

    const data = await response.json();
    
    // Extraer la respuesta del asistente
    // Gemini devuelve la respuesta en candidates[0].content.parts[0].text
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      console.error('Estructura de respuesta inesperada:', JSON.stringify(data, null, 2));
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No se recibió respuesta de Gemini' }),
      };
    }

    // Retornar la respuesta
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({
        response: assistantMessage,
      }),
    };

  } catch (error) {
    console.error('Error en la función:', error);
    console.error('Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error.message 
      }),
    };
  }
};
