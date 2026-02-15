gsap.registerPlugin(ScrollTrigger);

let heroPlayed = false;

/* -----------------------
   INTRO
------------------------ */
function playIntro() {
  const intro = document.querySelector("#intro");
  const light = document.querySelector(".intro-light");
  const logo  = document.querySelector(".intro-logo");

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      intro.style.pointerEvents = "none";
      setTimeout(() => animateHero(true), 40);
    }
  });

  gsap.set(intro, { autoAlpha: 1 });
  gsap.set(light, { autoAlpha: 0, scale: 0.98 });
  gsap.set(logo,  { autoAlpha: 0, y: 8 });

  tl.to({}, { duration: 0.9 })
    .to(light, { autoAlpha: 1, scale: 1, duration: 0.9 }, "+=0.05")
    .to(logo,  { autoAlpha: 1, y: 0, duration: 1.0 }, "-=0.55")
    .to(intro, { autoAlpha: 0, duration: 0.9 }, "-=0.2");

  return tl;
}

/* -----------------------
   HERO
------------------------ */
function prepHero() {
  gsap.set([".hero-eyebrow",".hero-rule",".hero-sub",".hero-cta"], { opacity: 0, x: -28 });
  gsap.set(".hero-line-inner", { opacity: 0, x: -140 });
}

function animateHero(force = false) {
  if (heroPlayed && !force) return;
  heroPlayed = true;

  gsap.killTweensOf([
    ".hero-eyebrow",".hero-rule",".hero-sub",".hero-cta",
    ".hero-line-inner",".hero-bg"
  ]);

  gsap.to([".hero-eyebrow", ".hero-rule", ".hero-sub", ".hero-cta"], {
    x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
    stagger: 0.12, overwrite: true
  });

  gsap.to(".hero-line-inner", {
    x: 0, opacity: 1, duration: 1.85, ease: "power4.out",
    stagger: 0.30, overwrite: true
  });

  gsap.to(".hero-bg", {
    scale: 1.02, duration: 1.4, ease: "power2.out", overwrite: true
  });
}

/* -----------------------
   VERTICAL REVEALS
------------------------ */
function revealGroup(targets, trigger) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;

  gsap.set(els, { y: 18, opacity: 0 });

  gsap.to(els, {
    y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
    stagger: 0.06,
    scrollTrigger: { trigger, start: "top 70%", once: true }
  });
}

/* -----------------------
   HORIZONTAL HELPERS
------------------------ */
function getPanelTargets(panel) {
  if (panel.querySelector(".about-wrap")) {
    return gsap.utils.toArray(panel.querySelectorAll(
      ".about-kicker,.about-title,.about-text,.about-card"
    ));
  }

  if (panel.querySelector(".spread")) {
    return gsap.utils.toArray(panel.querySelectorAll(
      ".spread-label,.spread-line,.spread-quote,.spread-editorial,.spread-image"
    ));
  }

  if (panel.classList.contains("transition-panel")) {
    return gsap.utils.toArray(panel.querySelectorAll(
      ".transition-kicker,.transition-title,.transition-rule,.transition-bullets li"
    ));
  }

  return [];
}

function hidePanel(panel) {
  const targets = getPanelTargets(panel);
  if (targets.length) gsap.set(targets, { y: 18, opacity: 0 });

  const line = panel.querySelector(".transition-line");
  if (line) gsap.set(line, { scaleY: 0, opacity: 0, transformOrigin: "top center" });

  panel.dataset.animated = "0";
}

function animateTransition(panel) {
  const els = panel.querySelectorAll(
    ".transition-kicker, .transition-title, .transition-rule, .transition-bullets li"
  );

  gsap.to(els, {
    y: 0, opacity: 1, duration: 0.95, ease: "power2.out",
    stagger: 0.08, overwrite: true
  });

  const line = panel.querySelector(".transition-line");
  if (line) {
    gsap.to(line, {
      scaleY: 1, opacity: 0.65, duration: 1.15,
      ease: "power2.out", overwrite: true
    });
  }
}

function animatePanel(panel) {
  if (!panel || panel.dataset.animated === "1") return;
  panel.dataset.animated = "1";

  if (panel.classList.contains("transition-panel")) {
    animateTransition(panel);
    return;
  }

  const targets = getPanelTargets(panel);
  if (!targets.length) return;

  gsap.to(targets, {
    y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
    stagger: 0.06, overwrite: true
  });
}

/* -----------------------
   PREP: esconder tudo dos horizontais
------------------------ */
function prepHorizontals() {
  document.querySelectorAll(".hz .panel").forEach(hidePanel);
}

/* -----------------------
   HORIZONTAL SETUP (com “marcos”)
------------------------ */
function setupHorizontal(section) {
  const track = section.querySelector(".hz-track");
  const ambient = document.querySelector(".ambient");
  if (!track) return;

  const panels = Array.from(section.querySelectorAll(".panel"));
  if (!panels.length) return;

  const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const endValue = () => "+=" + getDistance() * 1.15;

  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: endValue,
      pin: true,
      scrub: 1.35,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // glow sync
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: endValue,
    scrub: true,
    onUpdate: (self) => {
      if (!ambient) return;
      const t = self.progress;

      const gx = 38 + t * 36;
      const gy = 44 + Math.sin(t * Math.PI) * 8;
      const g1 = 0.18 + t * 0.10;
      const g2 = 0.20 - t * 0.05;
      const v  = 0.52 + Math.sin(t * Math.PI) * 0.05;

      ambient.style.setProperty("--gx", gx.toFixed(2) + "%");
      ambient.style.setProperty("--gy", gy.toFixed(2) + "%");
      ambient.style.setProperty("--g1", g1.toFixed(3));
      ambient.style.setProperty("--g2", g2.toFixed(3));
      ambient.style.setProperty("--v",  v.toFixed(3));
    }
  });

  // parallax leve
  section.querySelectorAll("img").forEach((img) => {
    gsap.to(img, {
      xPercent: -5,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".panel"),
        containerAnimation: tween,
        start: "left center",
        end: "right center",
        scrub: 1.1
      }
    });
  });

  // ✅ MARCOS: anima conforme o x do track atinge cada painel
  const panelWidth = () => window.innerWidth; // cada painel = 100vw
  const panelX = (i) => -i * panelWidth();    // posição do track quando painel i está “central”

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: endValue,
    scrub: true,
    onUpdate: () => {
      // valor atual do x do track (negativo)
      const x = gsap.getProperty(track, "x");

      // tolerância pra não ficar “no limite”
      const tol = panelWidth() * 0.35;

      panels.forEach((p, i) => {
        // se x está perto do marco desse painel -> anima
        if (Math.abs(x - panelX(i)) < tol) {
          animatePanel(p);
        }
      });
    }
  });
}

/* -----------------------
   START
------------------------ */
prepHero();
prepHorizontals();
playIntro();

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  once: true,
  onEnter: () => animateHero(false)
});

revealGroup(".services-kicker,.services-title,.services-sub,.service", ".services-section");
revealGroup(".timeline-ui .timeline-main,.timeline-ui .timeline-mini,.timeline-ui .social-ic", ".timeline-section");

document.querySelectorAll(".hz").forEach(setupHorizontal);

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

