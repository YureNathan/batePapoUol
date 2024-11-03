const acessAPI =
  "https://mock-api.driven.com.br/api/v6/uol/participants/5ad41206-f9b5-4be4-b498-e6b82295439c";
const mensagem = {
  hours: "20:31:01",
  name: "jumo",
  status: "entra na sala",
  mensage: "olá",
};
function getUser() {
  let usuario = prompt("Qual seu nome?");
  const resposta = axios.post(`${acessAPI}`, { name: `${usuario}` });
  resposta.then(sucess);
  resposta.catch(error);
  while (promess.status === 400) {
    let usuario = prompt("Qual seu nome?");
  }
}

function sucess(promess) {
  console.log(promess);
}

function error(promess) {}
// para entrar na sala
// getUser();

function getMensages() {
  const ul = document.querySelector(".chatMensagem");
  ul.innerHTML += `
  <li>${mensagem.hours}</li>
 `;
}
// getMensages();

// function menu 

function toggleMenu() {
  const menuLateral = document.querySelector('.menu-lateral');
  const fundoMenu = document.querySelector('.fundo-menu');
  menuLateral.classList.toggle('active');
  fundoMenu.classList.toggle('active');
}