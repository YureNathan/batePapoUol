const url =
  "https://mock-api.driven.com.br/api/v6/uol/participants/8c4912e2-6a29-4502-be46-830d79eae761";

let usuario;
let tempoUsuario;
const mensagem = {
  hours: "20:31:01",
  name: "jumo",
  status: "entra na sala",
  mensage: "olá",
};

function getUser() {
  usuario = prompt("Qual seu nome?");
  if (usuario === null) {
    console.log("O usuário cancelou a operação.");
    return;
  }
  axios
    .post(url, { name: usuario })
    .then(() => {
      alert("Nome cadastrado com sucesso!");
    })
    .catch((error) => {
      if (error.response.status === 400) {
        alert("Erro ao registrar esse nome. Tente novamente.");
        getUser();
      } else {
        alert(
          "Ocorreu um erro ao tentar verificar o nome. Tente novamente mais tarde."
        );
      }
    });
}
function renderizarMensagem(mensagem) {
  document.querySelector(".user").innerHTML = mensagem.name;
}
function verificarConexao() {
  tempoUsuario = setInterval(() => {
    axios
      .post(url, { name:usuario })
      .then(() => {
        console.log("Usuário ainda está presente.");
      })
      .catch((error) => {
        pararHeartbeat();
      });
  }, 5000);
}
function pararHeartbeat() {
  clearInterval(tempoUsuario);
  console.log("usuário saiu da sala.");
}
function getMensages() {
  const promess = axios.get(url);
  promess.then(renderizarMensagem);
}
getUser();
// getMensages();
verificarConexao();
// function menu

function toggleMenu() {
  const menuLateral = document.querySelector(".menu-lateral");
  const fundoMenu = document.querySelector(".fundo-menu");
  menuLateral.classList.toggle("active");
  fundoMenu.classList.toggle("active");
}
