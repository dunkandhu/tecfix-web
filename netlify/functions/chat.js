// Netlify Function para integrar con OpenAI

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
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY no está configurada');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'OpenAI API key no configurada. Por favor, configura OPENAI_API_KEY en Netlify.' 
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

    // Preparar el historial de conversación para OpenAI
    const messages = [
      {
        role: 'system',
        content: 'Eres un asistente virtual amigable y profesional de TecFix, una empresa de servicios tecnológicos. Ayudas a los usuarios con información sobre automatización, desarrollo web, pruebas de software y soluciones tecnológicas. Responde de manera clara, concisa y en español. Si no sabes algo, admítelo honestamente.'
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Preparar la petición a OpenAI
    const requestBody = {
      model: 'gpt-3.5-turbo', // Modelo gratuito o de bajo costo
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    };

    console.log('Enviando petición a OpenAI con', messages.length, 'mensajes');

    // Llamar a la API de OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Respuesta de OpenAI - Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de OpenAI:', errorData);
      
      // Mensajes de error más específicos según el tipo
      let errorMessage = 'Error al comunicarse con OpenAI';
      let userMessage = 'Error al comunicarse con OpenAI. Por favor, intenta de nuevo.';
      
      if (errorData.error) {
        const openaiError = errorData.error;
        
        // Error de autenticación
        if (openaiError.code === 'invalid_api_key' || openaiError.message?.includes('api key')) {
          errorMessage = 'API key inválida o expirada';
          userMessage = '⚠️ La API key de OpenAI no es válida. Por favor, verifica tu API key en Netlify.';
        }
        // Error de créditos
        else if (openaiError.code === 'insufficient_quota' || openaiError.message?.includes('quota')) {
          errorMessage = 'Sin créditos disponibles';
          userMessage = '⚠️ No tienes créditos disponibles en tu cuenta de OpenAI. Por favor, agrega fondos en https://platform.openai.com/account/billing';
        }
        // Error de rate limit
        else if (openaiError.code === 'rate_limit_exceeded') {
          errorMessage = 'Límite de solicitudes excedido';
          userMessage = '⚠️ Has excedido el límite de solicitudes. Por favor, espera un momento e intenta de nuevo.';
        }
        // Otros errores
        else {
          errorMessage = openaiError.message || errorMessage;
          userMessage = `⚠️ Error: ${openaiError.message || 'Error desconocido'}. Revisa los logs de Netlify para más detalles.`;
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
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No se recibió respuesta de OpenAI' }),
      };
    }

    // Retornar la respuesta
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Permitir CORS
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

