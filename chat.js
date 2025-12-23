// TecFix - Chat Widget con Google Gemini

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    // Elementos del DOM
    this.chatButton = document.getElementById('chatButton');
    this.chatWidget = document.getElementById('chatWidget');
    this.chatToggle = document.getElementById('chatToggle');
    this.chatBody = document.getElementById('chatBody');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.chatSend = document.getElementById('chatSend');

    // Event listeners
    this.chatButton?.addEventListener('click', () => this.openChat());
    this.chatToggle?.addEventListener('click', () => this.closeChat());
    this.chatSend?.addEventListener('click', () => this.sendMessage());
    this.chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Cargar mensajes existentes del HTML al historial
    const existingMessages = this.chatMessages?.querySelectorAll('.message');
    existingMessages?.forEach(msg => {
      const content = msg.querySelector('.message-content p')?.textContent;
      if (content) {
        const role = msg.classList.contains('user-message') ? 'user' : 'assistant';
        this.messages.push({ role, content });
      }
    });
  }

  openChat() {
    this.isOpen = true;
    this.chatWidget?.classList.add('open');
    this.chatButton?.classList.add('hidden');
    this.chatInput?.focus();
  }

  closeChat() {
    this.isOpen = false;
    this.chatWidget?.classList.remove('open');
    this.chatButton?.classList.remove('hidden');
  }

  addUserMessage(text) {
    if (!text.trim()) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;
    this.chatMessages?.appendChild(messageDiv);
    this.scrollToBottom();

    // Guardar mensaje
    this.messages.push({ role: 'user', content: text });
  }

  addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;
    this.chatMessages?.appendChild(messageDiv);
    this.scrollToBottom();

    // Guardar mensaje
    this.messages.push({ role: 'assistant', content: text });
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    this.chatMessages?.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator?.remove();
  }

  async sendMessage() {
    const message = this.chatInput?.value.trim();
    if (!message) return;

    // Deshabilitar input mientras se procesa
    this.setInputEnabled(false);

    // Agregar mensaje del usuario
    this.addUserMessage(message);
    this.chatInput.value = '';

    // Mostrar indicador de escritura
    this.showTypingIndicator();

    try {
      // Llamar a la función de Netlify
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: this.messages.slice(-10), // Últimos 10 mensajes para contexto
        }),
      });

      // Remover indicador de escritura antes de procesar respuesta
      this.removeTypingIndicator();

      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `Error ${response.status}`;
        let userMessage = 'Error al comunicarse con OpenAI. Por favor, intenta de nuevo.';
        
        try {
          const errorData = await response.json();
          // Usar el mensaje específico para el usuario si está disponible
          userMessage = errorData.userMessage || errorData.error || errorData.message || userMessage;
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Error del servidor:', errorData);
        } catch (e) {
          console.error('Error al parsear respuesta de error:', e);
        }

        // Mostrar el mensaje de error específico
        this.addBotMessage(userMessage);
        return;
      }

      const data = await response.json();
      
      // Agregar respuesta del bot
      if (data.response) {
        this.addBotMessage(data.response);
      } else if (data.error) {
        this.addBotMessage(`Error: ${data.error}`);
      } else {
        throw new Error('No se recibió respuesta válida');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.removeTypingIndicator();
      
      // Mensajes de error más específicos según el tipo
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        this.addBotMessage('⚠️ No se pudo conectar con el servidor. Verifica que la función de Netlify esté desplegada correctamente.');
      } else {
        this.addBotMessage(`Error: ${error.message}. Por favor, intenta de nuevo más tarde.`);
      }
    } finally {
      // Rehabilitar input
      this.setInputEnabled(true);
      this.chatInput?.focus();
    }
  }

  setInputEnabled(enabled) {
    if (this.chatInput) {
      this.chatInput.disabled = !enabled;
    }
    if (this.chatSend) {
      this.chatSend.disabled = !enabled;
    }
  }

  scrollToBottom() {
    if (this.chatMessages) {
      setTimeout(() => {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      }, 100);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar el chat cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ChatWidget();
});

