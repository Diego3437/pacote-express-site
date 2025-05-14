
// Firebase SDK v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3Nvwk8R2owj_J_LVuwR6om0g8Inr3M-eU",
  authDomain: "pacote-express.firebaseapp.com",
  projectId: "pacote-express",
  storageBucket: "pacote-express.appspot.com",
  messagingSenderId: "540485632596",
  appId: "1:540485632596:web:604667d08d99fcc75b23c1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/////////////////////// VIAGENS / PACOTES ///////////////////////
const tripForm = document.getElementById("trip-form");
const tripList = document.getElementById("trip-list");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroOrigem = document.getElementById("filtro-origem");
const filtroDestino = document.getElementById("filtro-destino");

if (tripForm) {
  tripForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tipo = document.getElementById("tipo").value;
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const data = document.getElementById("data").value;
    const espaco = document.getElementById("espaco").value;
    const preco = document.getElementById("preco").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const detalhes = document.getElementById("detalhes").value;

    await addDoc(collection(db, "viagens"), {
      tipo, origem, destino, data, espaco, preco, whatsapp, detalhes, criado: new Date()
    });

    tripForm.reset();
  });

  onSnapshot(collection(db, "viagens"), (snapshot) => {
    tripList.innerHTML = "";
    const ft = filtroTipo?.value.toLowerCase() || "";
    const fo = filtroOrigem?.value.toLowerCase() || "";
    const fd = filtroDestino?.value.toLowerCase() || "";

    snapshot.forEach((doc) => {
      const v = doc.data();
      if (
        (!ft || v.tipo.toLowerCase().includes(ft)) &&
        (!fo || v.origem.toLowerCase().includes(fo)) &&
        (!fd || v.destino.toLowerCase().includes(fd))
      ) {
        const li = document.createElement("li");
        li.className = "bg-white rounded-lg shadow-md p-4 border border-gray-200";
        const curta = v.detalhes?.length > 120 ? v.detalhes.slice(0, 120) + "..." : v.detalhes;
        const precisaExpandir = v.detalhes?.length > 120;

        li.innerHTML = `
          <div class="flex flex-col space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-white bg-blue-500 px-2 py-1 rounded">${v.tipo}</span>
              <span class="text-green-600 font-bold">$${v.preco || "n/d"}/kg</span>
            </div>
            <h3 class="text-lg font-semibold text-blue-700">
              ${v.origem} <span class="inline-block mx-1">✈️</span> ${v.destino}
            </h3>
            <p class="text-sm text-gray-500">🗓️ ${v.data}</p>
            <p class="text-sm text-gray-600">Espaço disponível: ${v.espaco || "n/d"} kg</p>
            <p class="text-gray-700 descricao">${curta || ""}</p>
            ${precisaExpandir ? `<button class="text-blue-600 text-xs underline ler-mais">Ler mais</button>` : ""}
            <a href="https://wa.me/${v.whatsapp.replace(/\D/g, '')}" target="_blank"
               class="inline-block mt-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
              WhatsApp
            </a>
          </div>
        `;
        tripList.appendChild(li);
      }
    });

    // Ler mais viagens
    setTimeout(() => {
      const botoes = document.querySelectorAll("#trip-list .ler-mais");
      botoes.forEach(btn => {
        btn.addEventListener("click", () => {
          const card = btn.closest("li");
          const snap = snapshot.docs.find(doc =>
            doc.data().detalhes?.startsWith(card.querySelector(".descricao").textContent.slice(0, 10))
          );
          if (snap) {
            card.querySelector(".descricao").textContent = snap.data().detalhes;
            btn.remove();
          }
        });
      });
    }, 100);
  });

  filtroTipo?.addEventListener("input", () => tripForm.dispatchEvent(new Event("submit")));
  filtroOrigem?.addEventListener("input", () => tripForm.dispatchEvent(new Event("submit")));
  filtroDestino?.addEventListener("input", () => tripForm.dispatchEvent(new Event("submit")));
}

/////////////////////// SERVIÇOS ///////////////////////
const serviceForm = document.getElementById("service-form");
const serviceList = document.getElementById("service-list");
const filtroServico = document.getElementById("filtro-servico");
const filtroCidade = document.getElementById("filtro-cidade");

if (serviceForm) {
  serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const servico = document.getElementById("servico").value;
    const nome = document.getElementById("nome").value;
    const cidade = document.getElementById("cidade").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const descricao = document.getElementById("descricao").value;

    await addDoc(collection(db, "servicos"), {
      servico, nome, cidade, whatsapp, descricao, criado: new Date()
    });

    serviceForm.reset();
  });

  onSnapshot(collection(db, "servicos"), (snapshot) => {
    serviceList.innerHTML = "";
    const fs = filtroServico?.value.toLowerCase() || "";
    const fc = filtroCidade?.value.toLowerCase() || "";

    snapshot.forEach((doc) => {
      const s = doc.data();
      if (
        (!fs || s.servico.toLowerCase().includes(fs)) &&
        (!fc || s.cidade.toLowerCase().includes(fc))
      ) {
        const li = document.createElement("li");
        li.className = "bg-white p-4 rounded shadow";

        const curta = s.descricao?.length > 120 ? s.descricao.slice(0, 120) + "..." : s.descricao;
        const precisaExpandir = s.descricao?.length > 120;

        li.innerHTML = `
          <h3 class="text-lg font-bold text-green-700">${s.servico}</h3>
          <p class="text-gray-600 descricao">${curta}</p>
          ${precisaExpandir ? `<button class="text-blue-600 text-xs underline ler-mais">Ler mais</button>` : ""}
          ${s.nome ? `<p class="text-sm text-gray-500">Profissional: ${s.nome}</p>` : ""}
          <p class="text-sm text-gray-500">📍 ${s.cidade}</p>
          <a href="https://wa.me/${s.whatsapp.replace(/\D/g, '')}" target="_blank"
             class="inline-block mt-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
            WhatsApp
          </a>
        `;
        serviceList.appendChild(li);
      }
    });

    setTimeout(() => {
      const botoes = document.querySelectorAll("#service-list .ler-mais");
      botoes.forEach(btn => {
        btn.addEventListener("click", () => {
          const card = btn.closest("li");
          const snap = snapshot.docs.find(doc =>
            doc.data().descricao?.startsWith(card.querySelector(".descricao").textContent.slice(0, 10))
          );
          if (snap) {
            card.querySelector(".descricao").textContent = snap.data().descricao;
            btn.remove();
          }
        });
      });
    }, 100);
  });

  filtroServico?.addEventListener("input", () => serviceForm.dispatchEvent(new Event("submit")));
  filtroCidade?.addEventListener("input", () => serviceForm.dispatchEvent(new Event("submit")));
}

/////////////////////// EVENTOS ///////////////////////
const eventoForm = document.getElementById("evento-form");
const eventosList = document.getElementById("eventos-list");

if (eventoForm) {
  eventoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const local = document.getElementById("local").value;
    const whatsapp = document.getElementById("whatsapp-evento").value;
    const descricao = document.getElementById("descricao").value;

    await addDoc(collection(db, "eventos"), {
      nome, data, local, whatsapp, descricao, criado: new Date()
    });

    eventoForm.reset();
    document.getElementById("mensagem")?.classList.remove("hidden");
  });

  onSnapshot(collection(db, "eventos"), (snapshot) => {
    eventosList.innerHTML = "";
    snapshot.forEach((doc) => {
      const ev = doc.data();
      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded shadow";

      const curta = ev.descricao?.length > 120 ? ev.descricao.slice(0, 120) + "..." : ev.descricao;
      const precisaExpandir = ev.descricao?.length > 120;

      div.innerHTML = `
        <h3 class="text-lg font-bold text-blue-700">${ev.nome}</h3>
        <p class="text-gray-600">📍 ${ev.local}</p>
        <p class="text-gray-600">🗓️ ${ev.data}</p>
        <p class="text-gray-700 mt-2 descricao">${curta}</p>
        ${precisaExpandir ? `<button class="text-blue-600 text-xs underline ler-mais">Ler mais</button>` : ""}
        ${ev.whatsapp ? `
          <a href="https://wa.me/${ev.whatsapp.replace(/\D/g, '')}" target="_blank"
             class="inline-block mt-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
            WhatsApp
          </a>` : ""}
      `;
      eventosList.appendChild(div);
    });

    setTimeout(() => {
      const botoes = document.querySelectorAll("#eventos-list .ler-mais");
      botoes.forEach(btn => {
        btn.addEventListener("click", () => {
          const card = btn.closest("div");
          const snap = snapshot.docs.find(doc =>
            doc.data().descricao?.startsWith(card.querySelector(".descricao").textContent.slice(0, 10))
          );
          if (snap) {
            card.querySelector(".descricao").textContent = snap.data().descricao;
            btn.remove();
          }
        });
      });
    }, 100);
  });
}

/////////////////////// CLASSIFICADOS ///////////////////////
const classificadoForm = document.getElementById("classificado-form");
const classificadosList = document.getElementById("classificados-list");
const filtroTitulo = document.getElementById("filtro-titulo");
const filtroCidadeAnuncio = document.getElementById("filtro-cidade-anuncio");

if (classificadoForm) {
  classificadoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const cidade = document.getElementById("cidade-anuncio").value;
    const whatsapp = document.getElementById("whats-anuncio").value;
    const descricao = document.getElementById("descricao-anuncio").value;

    await addDoc(collection(db, "classificados"), {
      titulo, cidade, whatsapp, descricao, criado: new Date()
    });

    classificadoForm.reset();
  });

  onSnapshot(collection(db, "classificados"), (snapshot) => {
    classificadosList.innerHTML = "";
    const ft = filtroTitulo?.value.toLowerCase() || "";
    const fc = filtroCidadeAnuncio?.value.toLowerCase() || "";

    snapshot.forEach((doc) => {
      const c = doc.data();
      if (
        (!ft || c.titulo.toLowerCase().includes(ft)) &&
        (!fc || c.cidade.toLowerCase().includes(fc))
      ) {
        const li = document.createElement("li");
        li.className = "bg-white p-4 rounded shadow";

        const curta = c.descricao?.length > 120 ? c.descricao.slice(0, 120) + "..." : c.descricao;
        const precisaExpandir = c.descricao?.length > 120;

        li.innerHTML = `
          <h3 class="text-lg font-bold text-yellow-700">${c.titulo}</h3>
          <p class="text-gray-600 descricao">${curta}</p>
          ${precisaExpandir ? `<button class="text-blue-600 text-xs underline ler-mais">Ler mais</button>` : ""}
          <p class="text-sm text-gray-500">📍 ${c.cidade}</p>
          <a href="https://wa.me/${c.whatsapp.replace(/\D/g, '')}" target="_blank"
             class="inline-block mt-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
            WhatsApp
          </a>
        `;
        classificadosList.appendChild(li);
      }
    });

    setTimeout(() => {
      const botoes = document.querySelectorAll("#classificados-list .ler-mais");
      botoes.forEach(btn => {
        btn.addEventListener("click", () => {
          const card = btn.closest("li");
          const snap = snapshot.docs.find(doc =>
            doc.data().descricao?.startsWith(card.querySelector(".descricao").textContent.slice(0, 10))
          );
          if (snap) {
            card.querySelector(".descricao").textContent = snap.data().descricao;
            btn.remove();
          }
        });
      });
    }, 100);
  });

  filtroTitulo?.addEventListener("input", () => classificadoForm.dispatchEvent(new Event("submit")));
  filtroCidadeAnuncio?.addEventListener("input", () => classificadoForm.dispatchEvent(new Event("submit")));
}