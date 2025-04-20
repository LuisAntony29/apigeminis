document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const responseOutput = document.getElementById('response-output');
    const copyBtn = document.getElementById('copy-btn');

    // --- Event Listeners ---

    // Evento al hacer clic en el botón Enviar
    sendBtn.addEventListener('click', handleSend);

    // Evento al presionar Enter en el textarea
    userInput.addEventListener('keypress', (event) => {
        // Verificar si la tecla presionada es Enter (y no Shift+Enter)
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Evitar el salto de línea por defecto
            handleSend();
        }
    });

    // Evento al hacer clic en el botón Limpiar
    clearBtn.addEventListener('click', () => {
        userInput.value = ''; // Limpiar el input
        responseOutput.textContent = 'Hola! Pregúntame algo sobre desarrollo web básico.'; // Restablecer respuesta inicial
        userInput.focus(); // Poner el foco de nuevo en el input
    });

    // Evento al hacer clic en el botón Copiar
    copyBtn.addEventListener('click', handleCopy);

    // --- Funciones ---

    // Función para manejar el envío de la pregunta
    function handleSend() {
        const question = userInput.value.trim(); // Obtener texto y quitar espacios extra

        if (question === '') {
            // Si no hay texto, no hacer nada o mostrar un mensaje
            responseOutput.textContent = 'Por favor, escribe una pregunta o saludo.';
            return;
        }

        // Obtener la respuesta del "cerebro" del bot
        const answer = getBotResponse(question);

        // Mostrar la respuesta
        responseOutput.textContent = answer;

        // No limpiar el input automáticamente para que el usuario vea su pregunta
        // userInput.value = '';
    }

    // Función para copiar el texto de la respuesta
    function handleCopy() {
        const textToCopy = responseOutput.textContent;

        if (!textToCopy || textToCopy === '...' || textToCopy === 'Hola! Pregúntame algo sobre desarrollo web básico.' || textToCopy === 'Por favor, escribe una pregunta o saludo.') {
            alert('No hay respuesta útil para copiar.');
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>
                 Copiado!`;
            copyBtn.classList.add('copied-feedback');

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied-feedback');
            }, 1500);

        }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err);
            alert('No se pudo copiar la respuesta. Inténtalo de nuevo.');
        });
    }


    // --- "Cerebro" del Chatbot --- (Versión mejorada)
    function getBotResponse(userInputText) {
        const input = userInputText.toLowerCase().trim().replace(/[¿?¡!]/g, ''); // Convertir a minúsculas, quitar espacios y signos de interrogación/exclamación

        // --- Sección I: Saludos y Cortesía ---
        if (input === 'hola' || input === 'buenos dias' || input === 'buenas tardes' || input === 'buenas noches' || input.includes('que tal') || input === 'hey') {
            return '¡Hola! ¿En qué puedo ayudarte hoy con HTML, CSS, JavaScript o APIs?';
        }
        if (input.includes('gracias')) {
            return '¡De nada! Si tienes más preguntas, no dudes en consultar.';
        }
         if (input === 'adios' || input === 'hasta luego' || input.includes('nos vemos')) {
            return '¡Hasta pronto! Que tengas un buen día.';
        }

        // --- Sección II: Conceptos de HTML ---
        if (input.includes('html')) {
            // Prioridad a 'para que sirve'
            if (input.includes('para que sirve') || input.includes('proposito') || input.includes('propósito')) {
                return 'HTML sirve para estructurar el contenido de una página web. Es como el "esqueleto" de la página, indicando qué es un título, qué es un párrafo, dónde va una imagen, etc., para que el navegador sepa cómo mostrarlo.';
            }
            // Luego 'que es' o 'definicion'
             if (input.includes('que es') || input.includes('definicion') || input.includes('definición')) {
                 return 'HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web. Define la estructura del contenido web usando elementos como encabezados, párrafos, imágenes, enlaces, etc.';
            }
            // Si solo dice "html"
             if (input === 'html') {
                 return 'HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web. Define la estructura del contenido.';
             }
        }

        // --- Sección III: Conceptos de CSS ---
        if (input.includes('css')) {
            // Prioridad a 'para que sirve' o 'proposito'
             if (input.includes('para que sirve') || input.includes('proposito') || input.includes('propósito')) {
                return 'CSS sirve para dar estilo y diseño visual a las páginas web creadas con HTML. Separa la presentación (cómo se ve) de la estructura (HTML), haciendo el código más limpio, fácil de mantener y permitiendo adaptar el diseño a diferentes dispositivos (responsividad).';
            }
             // Luego 'que es' o 'definicion'
             if (input.includes('que es') || input.includes('definicion') || input.includes('definición') || input.includes('define css')) {
                return 'CSS (Cascading Style Sheets) es un lenguaje de hojas de estilo usado para describir la presentación de un documento escrito en HTML. Controla cómo se ven los elementos: colores, fuentes, espaciados, diseño, animaciones, etc.';
            }
            // Si solo dice "css"
             if (input === 'css') {
                 return 'CSS (Cascading Style Sheets) es un lenguaje de hojas de estilo usado para describir la presentación visual de un documento HTML.';
             }
        }

        // --- Sección IV: Conceptos de JavaScript (JS) ---
        // Usamos '\bjs\b' para buscar "js" como palabra completa o 'javascript'
        if (input.includes('javascript') || /\bjs\b/.test(input)) {
            // Prioridad a 'para que sirve' o 'utilidad'
             if (input.includes('para que sirve') || input.includes('proposito') || input.includes('propósito') || input.includes('utilidad')) {
                 return 'JavaScript sirve para añadir interactividad y dinamismo a las páginas web. Se usa para cosas como: validar formularios, crear efectos visuales y animaciones, cargar datos del servidor sin recargar la página (AJAX), manipular el HTML y CSS, construir aplicaciones web completas (con frameworks como React, Angular, Vue), ¡y mucho más!';
            }
            // Luego 'que es' o 'definicion'
             if (input.includes('que es') || input.includes('definicion') || input.includes('definición')) {
                 return 'JavaScript (JS) es un lenguaje de programación versátil que permite implementar funcionalidades complejas e interactivas en las páginas web. Se ejecuta principalmente en el navegador del usuario.';
            }
            // Si solo dice "javascript" o "js"
             if (input === 'javascript' || input === 'js') {
                 return 'JavaScript (JS) es un lenguaje de programación que añade interactividad y dinamismo a las páginas web.';
             }
        }

        // --- Sección V: Conceptos de API y API REST ---
         // Pregunta específica sobre la diferencia (más específica, va primero)
        if (input.includes('diferencia') && input.includes('api') && input.includes('rest')) {
             return `Una API (Interfaz de Programación de Aplicaciones) es un concepto general: un conjunto de reglas para que dos programas se comuniquen. Es como el menú de un restaurante.\n\nUna API REST (Representational State Transfer) es un *tipo* específico y popular de API que sigue un conjunto de reglas (restricciones arquitectónicas) basadas en el protocolo HTTP (el de la web). Usa métodos estándar (GET, POST, PUT, DELETE) y es conocida por ser simple, escalable y sin estado.\n\nEn resumen: Toda API REST es una API, pero no toda API es REST. REST es un estilo arquitectónico para diseñar APIs.`;
        }
        // Pregunta sobre API REST (va antes que la genérica de API)
        if (input.includes('api rest')) {
             if (input.includes('que es') || input.includes('definicion') || input.includes('definición') || input.includes('explicame') || input.includes('explícame')) {
                return 'Una API REST (Representational State Transfer) es un estilo de arquitectura para diseñar APIs que se basa en los principios de la web (HTTP). Utiliza los métodos HTTP estándar (GET, POST, PUT, DELETE) para operar sobre "recursos" (datos) identificados por URLs. Son populares por su simplicidad, escalabilidad y por ser "stateless" (sin estado).';
             }
              if (input === 'api rest') {
                 return 'Una API REST es un tipo de API que sigue los principios de la arquitectura Representational State Transfer, usando HTTP para la comunicación.';
              }
        }
         // Pregunta sobre API en general
        if (input.includes('api')) { // Se asegura de que no incluya 'rest' para evitar conflicto
            if (input.includes('que es') || input.includes('definicion') || input.includes('definición') || input.includes('define api')) {
                return 'Una API (Interfaz de Programación de Aplicaciones) es un conjunto de reglas, definiciones y protocolos que permiten que diferentes aplicaciones de software se comuniquen entre sí. Actúa como un intermediario que permite solicitar funcionalidades o datos de otro servicio de forma estructurada.';
            }
             if (input === 'api') {
                 return 'Una API (Interfaz de Programación de Aplicaciones) es un conjunto de reglas que permite la comunicación entre diferentes programas.';
             }
        }

        // --- Sección VI: Preguntas No Reconocidas ---
        // Si ninguna de las condiciones anteriores se cumple.
        // Maneja preguntas como "cuanto es 2+2", "hablame del clima", "quien creo python"
        if (input.includes('cuanto es') || input.includes('clima') || input.includes('python')) {
             return 'Lo siento, mi conocimiento se centra en HTML, CSS, JavaScript y APIs. No puedo responder preguntas sobre matemáticas, clima o historia de otros lenguajes de programación por ahora.';
        }

        // Respuesta por defecto general si no coincide con nada conocido
        return 'Lo siento, no entendí esa pregunta o no tengo información sobre eso. Puedo ayudarte con conceptos básicos de HTML, CSS, JavaScript, APIs y la diferencia entre API y API REST. ¿Puedes intentar reformularla?';
    }

}); // Asegúrate que esta llave de cierre para DOMContentLoaded esté presente
