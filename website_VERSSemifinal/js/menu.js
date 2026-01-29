// Mobile menu behavior.
// Mantem o menu compacto em telas menores.
(() => {
  const Zara = window.Zara;
  const { qs, qsa } = Zara;

  // Abre e fecha o menu, atualizando aria-expanded para acessibilidade.
  const setupMenuToggle = () => {
    const nav = qs("#menu");
    const menuToggle = qs(".menu-toggle");
    if (!menuToggle || !nav) return;

    // Click no botao alterna a classe is-open.
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Fecha o menu quando o usuario clica em um link.
    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  };

  Zara.menu = { setupMenuToggle };
})();
