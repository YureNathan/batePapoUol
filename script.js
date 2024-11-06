const url = "https://mock-api.driven.com.br/api/v6/uol/";

let usuario;
let tempoUsuario;

function entrarSala() {
  usuario = prompt("Qual seu nome?");
  if (usuario === null) {
    return;
  }
  axios
    .post(url + "participants/f2dd5a8d-9ac0-42c8-8dc8-8853b8765425", {
      name: usuario,
    })
    .then(() => {
      alert("Nome cadastrado com sucesso!");
      // aqui vai ser as chamadas das funções e setTimeOut das funções
      verificarConexao();
      buscarMensagens();
      setInterval(buscarMensagens, 3000);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert("Usuário com esse nome já existe. Tente novamente.");
        entrarSala();
      }
    });
}

function verificarConexao() {
  tempoUsuario = setInterval(() => {
    axios
      .post(url + "status/f2dd5a8d-9ac0-42c8-8dc8-8853b8765425", {
        name: usuario,
      })
      .then(() => {
        console.log("Usuário ainda está presente.");
      })
      .catch(() => {
        usuarioDeslogado();
      });
  }, 5000);
}
function usuarioDeslogado() {
  clearInterval(tempoUsuario);
  console.log("usuário saiu da sala.");
}

function renderizarMensagens(mensagem) {
  const chat = document.querySelector(".chat");
  let html = "";
  mensagem.forEach((conteudo) => {
    let tipoCorMensagem = "";
    let textoMensagem = "";
    switch (conteudo.type) {
      case "status":
        tipoCorMensagem = "#dcdcdc";
        textoMensagem = ` <p class="time">(${conteudo.time})</p>
        <p class="user">${conteudo.from}</p>
        <p class="texto">${conteudo.text}</p>`;
        break;
      case "message":
        tipoCorMensagem = "#fff";
        textoMensagem = `<p class="time">(${conteudo.time})</p>
        <p class="user">${conteudo.from}</p>
        <span>para</span>
        <p class="user">${conteudo.to}</p>
        <span>:</span>
        <p class="texto">${conteudo.text}</p>`;
        break;
      case "private_message":
        tipoCorMensagem = "#ffdede";
        textoMensagem = `<p class="time">(${conteudo.time})</p> <p class="user">${conteudo.from}</p><span>reservadamente para</span><p class="user">${conteudo.to}</p><span>:</span><p class="texto">${conteudo.text}</p>`;
        break;
      default:
        tipoCorMensagem = "#fff";
        textoMensagem = `<span class="time">(${conteudo.time})</span> <strong>${conteudo.from}</strong> ${conteudo.text}`;
    }
    html += `<div class="chatMensagem" style="background-color: ${tipoCorMensagem}">
        ${textoMensagem}
      </div>`;
  });
  chat.innerHTML = html;
}
function buscarMensagens() {
  const promess = axios.get(
    url + "messages/f2dd5a8d-9ac0-42c8-8dc8-8853b8765425"
  );
  promess.then((response) => {
    renderizarMensagens(response.data);
  });
}
entrarSala();
// fazer a funcionalidade selecionar para quem quer enviar mensagem
function enviarMensagem() {
  const conteudoMensagem = document.querySelector(".mensagem").value;

  const mensagem = {
    from: usuario,
    to: "Todos",
    text: conteudoMensagem,
    type: "message",
  };
  const response = axios.post(
    url + "messages/f2dd5a8d-9ac0-42c8-8dc8-8853b8765425",
    mensagem
  );
  response.then(buscarMensagens);
  response.catch(console.error.response);
  document.querySelector(".mensagem").value = "";
}

function menuEscondido() {
  const menuLateral = document.querySelector(".menu-lateral");
  const fundoMenu = document.querySelector(".fundo-menu");
  menuLateral.classList.toggle("active");
  fundoMenu.classList.toggle("active");
}
