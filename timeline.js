// ✅ ORDEM + ANOS (do jeito que você pediu)
const timelineData = [
  { obra: "OBRA 10", year: "2025", img: "img/obra10.jpg",
    title: "Arquitetura que impõe presença — e permanece atual.",
    text: "Um projeto de leitura imediata: volumes bem marcados, planos limpos e um resultado que transmite segurança. A Luza trabalha o detalhe para que a estética não seja só bonita — mas também funcional no dia a dia."
  },
  { obra: "OBRA 9", year: "2025", img: "img/obra9.jpg",
    title: "Linhas precisas, conforto real.",
    text: "Uma proposta onde o minimalismo encontra a praticidade. O conjunto de volumes cria ritmo, enquanto a composição valoriza iluminação, circulação e sensação de amplitude."
  },
  { obra: "OBRA 5", year: "2025", img: "img/obra5.jpg",
    title: "Um lar com assinatura — sem exageros.",
    text: "Materiais equilibrados e proporções claras: a estética aparece no que é essencial. Tudo pensado para ficar atual com o tempo e fácil de viver todos os dias."
  },
  { obra: "OBRA 4", year: "2025", img: "img/obra4.jpg",
    title: "Detalhe e execução precisa.",
    text: "Mais do que construir, traduzimos conceitos arquitetônicos em espaços funcionais. Linhas limpas, proporções corretas e escolhas que elevam o padrão sem perder a essência."
  },
  { obra: "OBRA 3", year: "2025", img: "img/obra3.jpg",
    title: "Estética moderna com presença.",
    text: "Uma fachada que conversa com o entorno e, ao mesmo tempo, se destaca. Formas bem definidas e composição elegante para um resultado com personalidade."
  },
  { obra: "OBRA 2", year: "2025", img: "img/obra2.jpg",
    title: "Solução inteligente, visual forte.",
    text: "O projeto equilibra técnica e estética com escolhas diretas: volumes claros, acesso bem resolvido e um conjunto que transmite organização e alto padrão."
  },
  { obra: "OBRA 8", year: "2024", img: "img/obra8.jpg",
    title: "Equilíbrio entre calor e modernidade.",
    text: "Texturas e planos se complementam. Um desenho que valoriza aconchego, identidade e leveza — mantendo a linguagem contemporânea em cada detalhe."
  },
  { obra: "OBRA 7", year: "2024", img: "img/obra7.jpg",
    title: "Composição limpa, sensação de amplitude.",
    text: "Um projeto que privilegia espaços bem definidos e conforto. A fachada mantém leveza e proporção, com foco em funcionalidade e presença visual."
  },
  { obra: "OBRA 6", year: "2024", img: "img/obra6.jpg",
    title: "Clareza no traço, elegância no conjunto.",
    text: "Sem ruído. O desenho trabalha volumes com discrição e traz um resultado sofisticado, fácil de manter e com aparência sempre atual."
  },
  { obra: "OBRA 1", year: "2023", img: "img/obra1.jpg",
    title: "O início de uma linha que cresce.",
    text: "Um marco de evolução e consistência. Aqui começa a ideia de construir com estética, técnica e execução no detalhe — um padrão que vira assinatura."
  },
];

const timeline = document.getElementById("timeline");

/* cria as seções */
timelineData.forEach((item, i) => {
  const side = i % 2 === 0 ? "right" : "left";
  const imgs = [item.img, item.img, item.img]; // simula galeria (troca depois)

  const section = document.createElement("section");
  section.className = "snap-section tl-section";
  section.dataset.side = side;
  section.dataset.index = String(i);
  section.dataset.imgs = JSON.stringify(imgs);
  section.dataset.imgIndex = "0";

  section.innerHTML = `
    <div class="tl-grid">

      <div class="tl-year">
        <div class="tl-yearStack">${item.year.split("").join("<br>")}</div>
      </div>

      <div class="tl-center">
        <div class="tl-line">
          <div class="tl-lineProgress"></div>
        </div>

        <div class="tl-media">
          <button class="nav-arrow prev" aria-label="Foto anterior">
            <span class="chev">‹</span>
          </button>

          <div class="photo-card glow-card" style="--glow: 0.12;">
            <img class="tl-img" src="${item.img}" alt="${item.obra}">
          </div>

          <button class="nav-arrow next" aria-label="Próxima foto">
            <span class="chev">›</span>
          </button>
        </div>
      </div>

      <div class="tl-copy">
        <div class="tl-tag">LUZA</div>
        <h2 class="tl-title">${item.title}</h2>
        <p class="tl-text">${item.text}</p>

        <div class="tl-meta">
          <span class="dot"></span>
          <span>${item.obra} • GALERIA</span>
        </div>
      </div>

    </div>

    <div class="tl-hint">
      <a class="back-link" href="index.html">← VOLTAR AO INÍCIO</a>
    </div>
  `;

  timeline.appendChild(section);
});

const sections = [...document.querySelectorAll(".snap-section")];

let index = 0;
let locked = false;
let armed = false;
let armTimer = null;

function armAfterDelay(){
  armed = false;
  clearTimeout(armTimer);
  armTimer = setTimeout(() => armed = true, 650);
}

/* ✅ glow sincronizado com "descida" (progress 0..1) */
function setGlowForIndex(i){
  const progress = (sections.length <= 1) ? 0 : (i / (sections.length - 1)); // 0..1
  const glow = 0.10 + (progress * 0.90); // 0.10..1.00

  // aplica em todas, mas com foco mais forte na atual (fica premium)
  sections.forEach((sec, idx) => {
    const card = sec.querySelector(".glow-card");
    if(!card) return;

    const base = 0.06 + (progress * 0.55);            // base geral sobe com timeline
    const focusBoost = (idx === i) ? 0.35 : 0.00;     // destaque na seção atual
    const finalGlow = Math.min(1, base + focusBoost);

    gsap.to(card, {
      duration: 0.65,
      ease: "power2.out",
      "--glow": finalGlow
    });
  });
}

function animateSection(i){
  const section = sections[i];

  const line = section.querySelector(".tl-lineProgress");
  const imgCard = section.querySelector(".photo-card");
  const copy = section.querySelector(".tl-copy");
  const year = section.querySelector(".tl-yearStack");

  // ✅ linha desenhando com leve timelapse
  gsap.fromTo(line,
    { scaleY: 0 },
    { scaleY: 1, duration: 1.15, ease: "power2.out" }
  );

  gsap.fromTo(year,
    { y: 10, opacity: 0 },
    { y: 0, opacity: 0.85, duration: 0.7, ease: "power2.out" }
  );

  gsap.fromTo(imgCard,
    { y: 18, opacity: 0, scale: 0.985 },
    { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
  );

  gsap.fromTo(copy,
    { x: 22, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.85, delay: 0.08, ease: "power3.out" }
  );

  // ✅ glow sincronizado com a “descida”
  setGlowForIndex(i);
}

function goTo(i){
  const next = Math.max(0, Math.min(i, sections.length - 1));
  if (next === index){
    armAfterDelay();
    return;
  }

  index = next;
  locked = true;
  armed = false;
  clearTimeout(armTimer);

  sections[index].scrollIntoView({ behavior: "smooth" });

  setTimeout(() => animateSection(index), 120);

  setTimeout(() => {
    locked = false;
    armAfterDelay();
  }, 540);
}

/* iniciar */
sections[0].scrollIntoView({ behavior: "auto" });
animateSection(0);
armAfterDelay();

/* scroll travado */
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (locked || !armed) return;

  const dir = Math.sign(e.deltaY);
  if (dir > 0) goTo(index + 1);
  else if (dir < 0) goTo(index - 1);

  armed = false;
}, { passive:false });

window.addEventListener("keydown", (e) => {
  if (locked || !armed) return;

  if (["ArrowDown","PageDown"," "].includes(e.key)){
    e.preventDefault();
    goTo(index + 1);
    armed = false;
  }
  if (["ArrowUp","PageUp"].includes(e.key)){
    e.preventDefault();
    goTo(index - 1);
    armed = false;
  }
});

/* setas: troca foto da MESMA obra */
function changePhoto(section, dir){
  const imgs = JSON.parse(section.dataset.imgs);
  let idx = Number(section.dataset.imgIndex || "0");
  idx = (idx + dir + imgs.length) % imgs.length;
  section.dataset.imgIndex = String(idx);

  const imgEl = section.querySelector(".tl-img");

  gsap.to(imgEl, {
    opacity: 0,
    duration: 0.18,
    onComplete: () => {
      imgEl.src = imgs[idx];
      gsap.fromTo(imgEl,
        { opacity: 0, scale: 1.01 },
        { opacity: 1, scale: 1, duration: 0.32, ease: "power2.out" }
      );
    }
  });
}

sections.forEach((section) => {
  const prev = section.querySelector(".prev");
  const next = section.querySelector(".next");

  prev.addEventListener("click", () => changePhoto(section, -1));
  next.addEventListener("click", () => changePhoto(section, +1));
});
