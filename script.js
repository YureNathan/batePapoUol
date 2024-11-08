const url = "https://mock-api.driven.com.br/api/v6/uol/";

let usuario;
let tempoUsuario;
let destinatario = "Todos";
let visibilidade = "message";

function entrarSala() {
  usuario = prompt("Qual seu nome?");
  if (!usuario) return;
  axios
    .post(url + "participants/f0866e72-44ff-4d60-8a06-e2d391072b87", {
      name: usuario,
    })
    .then(() => {
      alert("Nome cadastrado com sucesso!");
      verificarConexao();
      buscarMensagens();
      setInterval(buscarMensagens, 3000);
      buscarParticipantes();
      setInterval(buscarParticipantes, 10000);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert("Erro ao registrar usuário. Tente novamente.");
        entrarSala();
      }
    });
}

function verificarConexao() {
  tempoUsuario = setInterval(() => {
    axios
      .post(url + "status/f0866e72-44ff-4d60-8a06-e2d391072b87", {
        name: usuario,
      })
      .then(() => {})
      .catch(() => {
        usuarioDeslogado();
      });
  }, 5000);
}
function usuarioDeslogado() {
  clearInterval(tempoUsuario);
}

function renderizarMensagens(mensagens) {
  const chat = document.querySelector(".chat");
  chat.innerHTML = "";

  mensagens.forEach((mensagem) => {
    let tipoCorMensagem = "";
    let textoMensagem = "";

    if (mensagem.type === "status") {
      tipoCorMensagem = "#dcdcdc";
      textoMensagem = `<p class="time">(${mensagem.time})</p><p class="user">${mensagem.from}</p><p class="texto">${mensagem.text}</p>`;
    } else if (mensagem.type === "message") {
      tipoCorMensagem = "#fff";
      textoMensagem = `<p class="time">(${mensagem.time})</p><p class="user">${mensagem.from}</p><span>para</span><p class="user">${mensagem.to}</p><span>:</span><p class="texto">${mensagem.text}</p>`;
    } else if (
      mensagem.type === "private_message" &&
      (mensagem.to === usuario ||
        mensagem.from === usuario ||
        mensagem.to === "Todos")
    ) {
      tipoCorMensagem = "#ffdede";
      textoMensagem = `<p class="time">(${mensagem.time})</p><p class="user">${mensagem.from}</p><span>reservadamente para</span><p class="user">${mensagem.to}</p><span>:</span><p class="texto">${mensagem.text}</p>`;
    } else {
      return;
    }
    chat.innerHTML += `<div class="chatMensagem" style="background-color: ${tipoCorMensagem}">
        ${textoMensagem}
      </div>`;
  });
  chat.lastElementChild?.scrollIntoView();
}
function buscarMensagens() {
  const promess = axios.get(
    url + "messages/f0866e72-44ff-4d60-8a06-e2d391072b87"
  );
  promess.then((response) => {
    renderizarMensagens(response.data);
  });
}

function enviarMensagem() {
  const conteudoMensagem = document.querySelector(".mensagem").value;
  if (!conteudoMensagem) return;

  const mensagem = {
    from: usuario,
    to: destinatario,
    text: conteudoMensagem,
    type: visibilidade,
  };
  const response = axios.post(
    url + "messages/f0866e72-44ff-4d60-8a06-e2d391072b87",
    mensagem
  );
  response.then(() => {
    buscarMensagens();
    document.querySelector(".mensagem").value = "";
  });
  response.catch((error) => {
    console.error("Erro ao enviar mensagem:", error);
    alert("O usuário Foi deslogado.");
    window.location.reload();
  });
}

function renderizarParticipantes(contato) {
  const ul = document.querySelector(".usuarios");
  ul.innerHTML = `
  <li onclick="selecionarContato('Todos', this)">
    <ion-icon name="people"></ion-icon>
    <span>Todos</span>
    <ion-icon name="checkmark" class="check" style="display: ${
      destinatario === "Todos" ? "inline" : "none"
    };"></ion-icon>
  </li>`;
  contato.forEach((participante) => {
    if (participante.name !== usuario) {
      ul.innerHTML += `<li class="user" onclick="selecionarContato('${
        participante.name
      }', this)">
        <ion-icon name="people"></ion-icon>
        <span>${participante.name}</span>
        <ion-icon name="checkmark" class="check" style="display: ${
          destinatario === participante.name ? "inline" : "none"
        };"></ion-icon>
      </li>`;
    }
  });
}

function selecionarContato(nome, elemento) {
  destinatario = nome;
  atualizarSelecao(elemento, ".usuarios li");
  atualizarMensagemDestinatario();
}

function selecionarVisibilidade(tipo, elemento) {
  visibilidade = tipo;
  atualizarSelecao(elemento, ".visibilidade li");
  atualizarMensagemDestinatario();
}

function atualizarMensagemDestinatario() {
  const tipoSalaElemento = document.querySelector(".tipoSala");
  tipoSalaElemento.innerText = `Enviando para ${destinatario} ${
    visibilidade === "private_message" ? "(reservadamente)" : "(público)"
  }`;
}
function atualizarSelecao(elementoSelecionado, classe) {
  document.querySelectorAll(classe).forEach((elemento) => {
    elemento.classList.remove("selecionado");
    elemento.querySelector(".check").style.display = "none";
  });
  elementoSelecionado.classList.add("selecionado");
  elementoSelecionado.querySelector(".check").style.display = "inline";
}

function buscarParticipantes() {
  axios
    .get(url + "participants/f0866e72-44ff-4d60-8a06-e2d391072b87")
    .then((response) => renderizarParticipantes(response.data))
    .catch(() => {
      console.error("Erro ao buscar participantes:");
    });
}

function menuEscondido() {
  const menuLateral = document.querySelector(".menu-lateral");
  const fundoMenu = document.querySelector(".fundo-menu");
  menuLateral.classList.toggle("active");
  fundoMenu.classList.toggle("active");
}

entrarSala();
