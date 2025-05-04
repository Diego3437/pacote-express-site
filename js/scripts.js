import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3Nvwk8R2owjJ_LVuwR6om0g8Inr3M-eU",
  authDomain: "pacote-express.firebaseapp.com",
  projectId: "pacote-express",
  storageBucket: "pacote-express.firebasestorage.app",
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

btnViajante.addEventListener('click', () => {
  secFormViajante.classList.remove('hidden');
  secFormEnvio.classList.add('hidden');
});

btnRemetente.addEventListener('click', () => {
  secFormEnvio.classList.remove('hidden');
  secFormViajante.classList.add('hidden');
});

function formatWhatsAppNumber(number) {
  return number.replace(/[^+0-9]/g, '');
}

// Submissão de viagem
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const whatsapp = formatWhatsAppNumber(document.getElementById('whatsapp').value);
  const origem = document.getElementById('origem').value;
  const destino = document.getElementById('destino').value;
  const data = document.getElementById('data').value;
  const espaco = document.getElementById('espaco').value;
  const preco = document.getElementById('preco').value;

  try {
    await addDoc(collection(db, "viagens"), {
      nome, whatsapp, origem, destino, data, espaco, preco
    });
    form.reset();
  } catch (error) {
    console.error("Erro ao salvar viagem:", error);
  }
});

// Submissão de envio
envioForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('remetente').value;
  const whatsapp = formatWhatsAppNumber(document.getElementById('whatsapp-remetente').value);
  const origem = document.getElementById('origem-envio').value;
  const destino = document.getElementById('destino-envio').value;
  const peso = document.getElementById('peso-envio').value;
  const descricao = document.getElementById('descricao-envio').value;

  try {
    await addDoc(collection(db, "envios"), {
      nome, whatsapp, origem, destino, peso, descricao
    });
    envioForm.reset();
  } catch (error) {
    console.error("Erro ao salvar envio:", error);
  }
});

// Renderização de viagem
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

// Renderização de envio
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

// Atualização em tempo real
onSnapshot(collection(db, "viagens"), snapshot => {
  lista.innerHTML = "";
  snapshot.forEach(doc => renderViagem(doc));
});

onSnapshot(collection(db, "envios"), snapshot => {
  listaEnvios.innerHTML = "";
  snapshot.forEach(doc => renderEnvio(doc));
});

// Filtro de buscas
inputBusca.addEventListener('input', function () {
  const termo = inputBusca.value.toLowerCase();
  const itens = lista.querySelectorAll('li');
  itens.forEach(item => {
    item.style.display = item.innerText.toLowerCase().includes(termo) ? '' : 'none';
  });
});
