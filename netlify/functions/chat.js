// Netlify Function para integrar con OpenAI

exports.handler = async (event, context) => {
  // Solo permitir métodos POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Obtener la API key de las variables de entorno
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'OpenAI API key no configurada. Por favor, configura OPENAI_API_KEY en Netlify.' 
        }),
      };
    }

    // Parsear el cuerpo de la petición
    const { message, conversationHistory = [] } = JSON.parse(event.body);

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
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

    // Llamar a la API de OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Modelo gratuito o de bajo costo
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de OpenAI:', errorData);
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Error al comunicarse con OpenAI',
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
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error.message 
      }),
    };
  }
};

