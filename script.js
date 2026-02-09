gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.killAll();

const sections = [...document.querySelectorAll(".snap-section")];

let index = 0;
let locked = false;
let armed = false;
let armTimer = null;

let heroPlayed = false;

function armAfterDelay(ms = 1500){
  armed = false;
  clearTimeout(armTimer);
  armTimer = setTimeout(() => (armed = true), ms);
}

/* HERO — REVEAL MAIS LENTO (revista / cinema) */
function animateHero(force = false){
  if (heroPlayed && !force) return;
  heroPlayed = true;

  gsap.killTweensOf([
    ".hero-eyebrow", ".hero-rule", ".hero-sub",
    ".hero-line-inner", ".hero-bg"
  ]);

  // elementos de apoio (rápidos, mas elegantes)
  gsap.fromTo(
    [".hero-eyebrow", ".hero-rule", ".hero-sub"],
    { x: -28, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      overwrite: true
    }
  );

  // ✅ TÍTULO — REVEAL MAIS DEVAGAR
  gsap.fromTo(
    ".hero-line-inner",
    { x: -140, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.85,     // ← mais tempo
      ease: "power4.out",
      stagger: 0.30,      // ← mais leitura entre linhas
      overwrite: true
    }
  );

  gsap.to(".hero-bg", {
    scale: 1.02,
    duration: 1.4,
    ease: "power2.out",
    overwrite: true
  });
}

/* SPREADS */
function animateSpread(section){
  const labelText = section.querySelector(".spread-label")?.textContent?.trim()?.toUpperCase();
  const isLuzaPage = labelText === "LUZA";

  const img = section.querySelector(".spread-image");
  const label = section.querySelector(".spread-label");
  const line = section.querySelector(".spread-line");
  const quote = section.querySelector(".spread-quote");
  const body = section.querySelector(".spread-editorial");

  if (img) {
    gsap.fromTo(
      img,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", overwrite: true }
    );
  }

  if (isLuzaPage) {
    const tl = gsap.timeline({ delay: 0.08 });

    tl.fromTo(label, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
      .fromTo(line,  { scaleX: 0, opacity: 0, transformOrigin: "left center" },
                    { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.15")
      .fromTo(quote, { y: 14, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, "+=0.15")
      .fromTo(body,  { y: 12, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" }, "-=0.35");
    return;
  }

  const els = [label, line, quote, body].filter(Boolean);
  gsap.fromTo(
    els,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: "power2.out", overwrite: true }
  );
}

/* FINALE */
function animateFinale(){
  gsap.fromTo(
    ".finale-kicker, .finale-title, .finale-rule, .finale-text",
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power2.out", overwrite: true }
  );

  gsap.fromTo(
    ".finale-cta",
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, ease: "power2.out", delay: 0.2, overwrite: true }
  );
}

function animateSection(i){
  const section = sections[i];

  if(section.classList.contains("hero")){
    animateHero();
    return;
  }

  if(section.classList.contains("spread")){
    animateSpread(section);
    return;
  }

  if(section.classList.contains("finale")){
    animateFinale();
    return;
  }
}

/* INTRO */
function playIntro(){
  const intro = document.querySelector("#intro");
  const light = document.querySelector(".intro-light");
  const logo = document.querySelector(".intro-logo");

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      intro.style.pointerEvents = "none";
      armAfterDelay(650);
    }
  });

  gsap.set(intro, { autoAlpha: 1 });
  gsap.set(light, { autoAlpha: 0, scale: 0.98 });
  gsap.set(logo, { autoAlpha: 0, y: 8 });

  tl.to({}, { duration: 1.0 })
    .to(light, { autoAlpha: 1, scale: 1, duration: 0.9 }, "+=0.05")
    .to(logo, { autoAlpha: 1, y: 0, duration: 1.0 }, "-=0.5")
    .add(() => animateHero(true), "-=0.45")
    .to(intro, { autoAlpha: 0, duration: 0.9 }, "-=0.2");

  return tl;
}

/* SCROLL */
function goTo(i){
  const next = Math.max(0, Math.min(i, sections.length - 1));
  if(next === index){
    armAfterDelay();
    return;
  }

  index = next;
  locked = true;
  armed = false;
  clearTimeout(armTimer);

  sections[index].scrollIntoView({ behavior: "smooth", block: "start" });

  setTimeout(() => animateSection(index), 80);

  setTimeout(() => {
    locked = false;
    armAfterDelay(1500);
  }, 450);
}

/* START */
sections[0].scrollIntoView({ behavior: "auto", block: "start" });
armed = false;
locked = false;

playIntro();

window.addEventListener("wheel", (e) => {
  e.preventDefault();
  if(locked || !armed) return;

  const dir = Math.sign(e.deltaY);
  if(dir > 0) goTo(index + 1);
  else if(dir < 0) goTo(index - 1);

  armed = false;
}, { passive: false });

window.addEventListener("keydown", (e) => {
  if(locked || !armed) return;

  if(["ArrowDown","PageDown"," "].includes(e.key)){
    e.preventDefault();
    goTo(index + 1);
    armed = false;
  }

  if(["ArrowUp","PageUp"].includes(e.key)){
    e.preventDefault();
    goTo(index - 1);
    armed = false;
  }
});
