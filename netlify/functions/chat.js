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

    // Llamar a la API de Gemini (capa gratuita)
    // Usamos gemini-pro que está disponible en v1beta y es gratuito
    const model = 'gemini-pro'; // Modelo gratuito y estable
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Respuesta de Gemini - Status:', response.status);

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
