import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3Nvwk8R2owjJ_LVuwR6om0g8Inr3M-eU",
  authDomain: "pacote-express.firebaseapp.com",
  projectId: "pacote-express",
  messagingSenderId: "540485632596",
  appId: "1:540485632596:web:604667d08d99fcc75b23c1"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos
const form = document.getElementById('trip-form');
const lista = document.getElementById('viagens');
const envioForm = document.getElementById('envio-form');
const listaEnvios = document.getElementById('envios');
const inputBusca = document.getElementById('busca-destino');
const btnViajante = document.getElementById('btn-viajante');
const btnRemetente = document.getElementById('btn-remetente');
const secFormViajante = document.getElementById('formulario');
const secFormEnvio = document.getElementById('formulario-envio');
const servicoForm = document.getElementById('servico-form');
const listaServicos = document.getElementById('lista-servicos');
const filtroServico = document.getElementById('filtro-servico');

// Trocar formulários
btnViajante.addEventListener('click', () => {
  secFormViajante.classList.remove('hidden');
  secFormEnvio.classList.add('hidden');
});

btnRemetente.addEventListener('click', () => {
  secFormEnvio.classList.remove('hidden');
  secFormViajante.classList.add('hidden');
});

// Formatador de WhatsApp
function formatWhatsAppNumber(number) {
  return number.replace(/[^+0-9]/g, '');
}

// Enviar viagem
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const whatsapp = formatWhatsAppNumber(document.getElementById('whatsapp').value);
  const origem = document.getElementById('origem').value;
  const destino = document.getElementById('destino').value;
  const data = document.getElementById('data').value;
  const espaco = document.getElementById('espaco').value;
  const preco = document.getElementById('preco').value;

  await addDoc(collection(db, "viagens"), {
    nome, whatsapp, origem, destino, data, espaco, preco
  });

  form.reset();
});

// Mostrar viagens
function renderViagem(doc) {
  const data = doc.data();
  const link = `https://wa.me/${formatWhatsAppNumber(data.whatsapp)}?text=Olá, vi sua viagem no Pacote Express para ${data.destino}!`;

  const item = document.createElement('li');
  item.innerHTML = `
    🧳 <strong>${data.nome}</strong><br>
    📍 De: ${data.origem} → ✈️ Para: ${data.destino}<br>
    📅 Data: ${data.data} | 📦 Espaço: ${data.espaco}kg | 💵 $${data.preco}/kg
    <br><a class="contato-btn" href="${link}" target="_blank">Entrar em contato</a>
  `;
  lista.appendChild(item);
}

onSnapshot(collection(db, "viagens"), snapshot => {
  lista.innerHTML = "";
  snapshot.forEach(doc => renderViagem(doc));
});

// Filtro de busca
inputBusca.addEventListener('input', function () {
  const termo = inputBusca.value.toLowerCase();
  const itens = lista.querySelectorAll('li');
  itens.forEach(item => {
    item.style.display = item.innerText.toLowerCase().includes(termo) ? '' : 'none';
  });
});

// Enviar pedido de envio
envioForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('remetente').value;
  const whatsapp = formatWhatsAppNumber(document.getElementById('whatsapp-remetente').value);
  const origem = document.getElementById('origem-envio').value;
  const destino = document.getElementById('destino-envio').value;
  const peso = document.getElementById('peso-envio').value;
  const descricao = document.getElementById('descricao-envio').value;

  await addDoc(collection(db, "envios"), {
    nome, whatsapp, origem, destino, peso, descricao
  });

  envioForm.reset();
});

// Mostrar envios
function renderEnvio(doc) {
  const data = doc.data();
  const link = `https://wa.me/${formatWhatsAppNumber(data.whatsapp)}?text=Olá, vi seu pedido de envio no Pacote Express para ${data.destino}!`;

  const item = document.createElement('li');
  item.innerHTML = `
    📦 <strong>${data.nome}</strong> quer enviar: ${data.descricao}<br>
    📍 De: ${data.origem} → Para: ${data.destino} | ⚖️ Peso: ${data.peso}kg
    <br><a class="contato-btn" href="${link}" target="_blank">Entrar em contato</a>
  `;
  listaEnvios.appendChild(item);
}

onSnapshot(collection(db, "envios"), snapshot => {
  listaEnvios.innerHTML = "";
  snapshot.forEach(doc => renderEnvio(doc));
});

// Enviar serviço
servicoForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome-servico').value;
  const whatsapp = formatWhatsAppNumber(document.getElementById('whatsapp-servico').value);
  const cidade = document.getElementById('cidade-servico').value;
  const descricao = document.getElementById('descricao-servico').value;

  await addDoc(collection(db, "servicos"), {
    nome, whatsapp, cidade, descricao
  });

  servicoForm.reset();
});

// Mostrar serviços
function renderServico(doc) {
  const data = doc.data();
  const link = `https://wa.me/${formatWhatsAppNumber(data.whatsapp)}?text=Olá, vi seu serviço no Pacote Express!`;

  const item = document.createElement('li');
  item.innerHTML = `
    👨‍🔧 <strong>${data.nome}</strong> - ${data.descricao}<br>
    📍 Cidade: ${data.cidade}
    <br><a class="contato-btn" href="${link}" target="_blank">Entrar em contato</a>
  `;
  listaServicos.appendChild(item);
}

filtroServico.addEventListener('input', function () {
  const termo = filtroServico.value.toLowerCase();
  const itens = listaServicos.querySelectorAll('li');
  itens.forEach(item => {
    item.style.display = item.innerText.toLowerCase().includes(termo) ? '' : 'none';
  });
});

onSnapshot(collection(db, "servicos"), snapshot => {
  listaServicos.innerHTML = "";
  snapshot.forEach(doc => renderServico(doc));
});
