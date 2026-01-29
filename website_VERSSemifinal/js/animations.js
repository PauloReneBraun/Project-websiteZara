// Intersection observer for reveal animations.
// Mantem a animacao leve e so quando o elemento aparece.
(() => {
  const Zara = window.Zara;
  const { qsa } = Zara;

  // Configura animacoes baseadas em data-animate.
  const setupAnimations = () => {
    const animatedElements = qsa("[data-animate]");
    // data-delay permite escalonar entradas.
    animatedElements.forEach((el) => {
      if (el.dataset.delay) {
        el.style.setProperty("--delay", el.dataset.delay);
      }
    });

    // Fallback para navegadores sem IntersectionObserver.
    if (!("IntersectionObserver" in window)) {
      animatedElements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Observa quando o elemento entra no viewport para animar.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach((el) => observer.observe(el));
  };

  Zara.animations = { setupAnimations };
})();
