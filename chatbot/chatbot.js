//Seleciona os elementos HTML relevantes usando seletores de classe 
const enviarMsg = document.querySelector(".chat-entrada span"); //botao de envio de mensagem
const areaTexto = document.querySelector(".chat-entrada textarea"); //Área de texto onde o usuário digita a mensagem
const chatBox = document.querySelector(".chatbox"); //Container onde as mensagens são exibidas
const abrfecChat = document.querySelector(".chatbot-toggler");
const botaofechamedia = document.querySelector(".botaofecha");

let msgUsuario; //varaivel para armazenar a ensagem do usuario
const API_KEY = "sk-proj-gbf4zejDf8WYvFkIUL3aT3BlbkFJBtRq2pK45H3xVME4vNwV"; //Chave de API da OpenAI, insira sua chave aqui, cada um com a sua
const tamanhoInput = areaTexto.scrollHeight;

// Função para criar e retornar um elemento <li> para exibir mensagens no chat
const criarChatli = (message, className) => {
    //criar um elemento <li> para o chat classe recebido com a mensagem do ususario 
    const chatLi = document.createElement("li"); // Cria um novo elemento <li>
    chatLi.classList.add("chat", className); // Adiciona classes ao elemento <li> para estilização
    // Conteúdo da mensagem a ser exibida dentro do elemento <li>, dependendo da classe CSS recebida
    let conteudoChat = className === "recebido" ? `<p></p>` : `<span>img</span><p></p>`;
    chatLi.innerHTML = conteudoChat; // Define o conteúdo HTML do elemento <li>
    chatLi.querySelector("p").textContent = message;
    return chatLi; // Retorna o elemento <li> criado
}
// Função para gerar uma resposta da OpenAI quando o usuário envia uma mensagem
const gerarResposta = (chatEnviadoli) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const msgResp = chatEnviadoli.querySelector("p");

    // Opções para a solicitação HTTP POST para a API da OpenAI
    const opcaoSolicit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Usa a chave de API para autorização
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Modelo de linguagem a ser usado para gerar respostas
            messages: [{ role: "user", content: msgUsuario }]  // Mensagem do usuário a ser enviada para a OpenAI
        })
    }

    //Envia  solicitação POST para a  API, recebe resposta
    fetch(API_URL, opcaoSolicit).then(res => res.json()).then(data => {
        //console.log(data);
        msgResp.textContent = data.choices[0].message.content;
    }).catch((error) => {
        msgResp.classList.add("error");
        //console.log(error);
        msgResp.textContent = "Opa! Algo deu errado. Por favor, tente novamente.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}

// Função principal que gerencia o fluxo de interação do chat
const fluxoChat = () => {
    msgUsuario = areaTexto.value.trim(); //para tirar o espaço em branco sobrando da mesnagem
    //console.log(msgUsuario)
    //se estiver vazio então retornará, retorna sem fazer nada
    if (!msgUsuario) return;
    areaTexto.value = "";
    areaTexto.style.height = `${tamanhoInput}px`;

    //Adiciona as mensagens do usuário dentro da interface da chatbox
    chatBox.appendChild(criarChatli(msgUsuario, "recebido"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const chatEnviadoli = criarChatli("Digitando...", "enviado")
        chatBox.appendChild(chatEnviadoli); //Mostra "digitando..." dentro da chatbox na parte na chatgirl enquanto a pessoa aguarda a resolução da pergunta
        chatBox.scrollTo(0, chatBox.scrollHeight);
        gerarResposta(chatEnviadoli); // Chama a função para gerar a resposta da OpenAI
    }, 650); // Tempo de espera antes de simular que a resposta está sendo gerada
}

areaTexto.addEventListener("input", () => {
    //Ajusta  a altura da textarea de acordo com o tamanho da mensagem enviada
    areaTexto.style.height = `${tamanhoInput}px`;
    areaTexto.style.height = `${areaTexto.scrollHeight}px`;
});

areaTexto.addEventListener("keyup", (e) => {
    //se apertar a tecla enter sem o shift e a janela for maior que 800px manda a mensagem para o fluxo de menagens
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        fluxoChat();
    }
});

// Adiciona um ouvinte de evento de clique ao botão de envio de mensagem para acionar o fluxo do chat
enviarMsg.addEventListener("click", fluxoChat);
botaofechamedia.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
abrfecChat.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
