import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3Nvwk8R2owjJ_LVuwR6om0g8Inr3M-eU",
  authDomain: "pacote-express.firebaseapp.com",
  projectId: "pacote-express",
  storageBucket: "pacote-express.appspot.com",
  messagingSenderId: "540485632596",
  appId: "1:540485632596:web:604667d08d99fcc75b23c1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------- VIAGENS / PACOTES ----------
const tripForm = document.getElementById("trip-form");
const tripList = document.getElementById("trip-list");

tripForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    tipo: document.getElementById("tipo").value,
    origem: document.getElementById("origem").value,
    destino: document.getElementById("destino").value,
    data: document.getElementById("data").value,
    espaco: document.getElementById("espaco").value,
    preco: document.getElementById("preco").value,
    whatsapp: document.getElementById("whatsapp").value,
    detalhes: document.getElementById("detalhes").value,
  };

  await addDoc(collection(db, "viagens"), data);
  tripForm.reset();
});

let viagensCache = [];

function aplicarFiltros(data, container) {
  const destinoFiltro = document.getElementById("filtro-destino").value.toLowerCase();
  const origemFiltro = document.getElementById("filtro-origem").value.toLowerCase();
  const tipoFiltro = document.getElementById("filtro-tipo").value;

  container.innerHTML = "";

  data.forEach((doc) => {
    const v = doc.data();
    const destinoOk = (v.destino || "").toLowerCase().includes(destinoFiltro);
    const origemOk = (v.origem || "").toLowerCase().includes(origemFiltro);
    const tipoOk = tipoFiltro === "" || v.tipo === tipoFiltro;

    if (destinoOk && origemOk && tipoOk) {
      const li = document.createElement("li");
      li.className = "bg-white shadow rounded p-4 flex flex-col gap-2";

      li.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">${v.tipo || "-"}</span>
          <span class="text-xs text-gray-500">${v.data || "-"}</span>
        </div>
        <div class="flex items-center text-lg font-semibold text-gray-800">
          <span>${v.origem || "-"}</span>
          <span class="mx-2">✈️</span>
          <span>${v.destino || "-"}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="bg-gray-100 px-3 py-1 rounded text-sm">📦 ${v.espaco || "?"} kg</span>
          <span class="text-green-600 font-medium">$${v.preco || "-"}</span>
        </div>
        <p class="text-sm text-gray-600">${v.detalhes || ""}</p>
        <a href="https://wa.me/${(v.whatsapp || "").replace(/\\D/g, '')}" target="_blank" class="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded w-fit">
          Entrar em contato
        </a>
      `;
      container.appendChild(li);
    }
  });
}

["filtro-destino", "filtro-origem", "filtro-tipo"].forEach((id) =>
  document.getElementById(id).addEventListener("input", () => aplicarFiltros(viagensCache, tripList))
);

onSnapshot(collection(db, "viagens"), (snapshot) => {
  viagensCache = [];
  snapshot.forEach((doc) => viagensCache.push(doc));
  aplicarFiltros(viagensCache, tripList);
});

// ---------- SERVIÇOS ----------
const serviceForm = document.getElementById("service-form");
const serviceList = document.getElementById("service-list");

serviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    servico: document.getElementById("servico").value,
    cidade: document.getElementById("cidade").value,
    descricao: document.getElementById("descricao").value,
    whatsapp: document.getElementById("whats-servico").value,
  };

  await addDoc(collection(db, "servicos"), data);
  serviceForm.reset();
});

let servicosCache = [];

function aplicarFiltrosServicos(data, container) {
  const servicoFiltro = document.getElementById("filtro-servico").value.toLowerCase();
  const cidadeFiltro = document.getElementById("filtro-cidade").value.toLowerCase();

  container.innerHTML = "";

  data.forEach((doc) => {
    const s = doc.data();
    const servicoOk = (s.servico || "").toLowerCase().includes(servicoFiltro);
    const cidadeOk = (s.cidade || "").toLowerCase().includes(cidadeFiltro);

    if (servicoOk && cidadeOk) {
      const li = document.createElement("li");
      li.className = "bg-white shadow rounded p-4 flex flex-col gap-2";
      li.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-gray-800">${s.servico || "-"}</span>
          <span class="text-sm text-gray-500">${s.cidade || "-"}</span>
        </div>
        <p class="text-sm text-gray-700">${s.descricao || ""}</p>
        <a href="https://wa.me/${(s.whatsapp || "").replace(/\\D/g, '')}" target="_blank" class="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded w-fit">
          Entrar em contato
        </a>
      `;
      container.appendChild(li);
    }
  });
}

["filtro-servico", "filtro-cidade"].forEach((id) =>
  document.getElementById(id).addEventListener("input", () => aplicarFiltrosServicos(servicosCache, serviceList))
);

onSnapshot(collection(db, "servicos"), (snapshot) => {
  servicosCache = [];
  snapshot.forEach((doc) => servicosCache.push(doc));
  aplicarFiltrosServicos(servicosCache, serviceList);
});
