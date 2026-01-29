// Carrega ficheiros HTML menores e monta a pagina em runtime.
(() => {
  const Zara = (window.Zara = window.Zara || {});

  const loadComponents = async () => {
    const placeholders = [
      ...document.querySelectorAll("[data-include]"),
    ];

    const tasks = placeholders.map(async (placeholder) => {
      const url = placeholder.getAttribute("data-include");
      if (!url) return;

      try {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`Falha ao carregar ${url}`);
        }
        const html = await response.text();
        // Substitui o placeholder pelo HTML do componente.
        placeholder.outerHTML = html;
      } catch (error) {
        placeholder.innerHTML =
          "<p class=\"component-error\">Falha ao carregar componente.</p>";
      }
    });

    await Promise.all(tasks);
  };

  Zara.ready = loadComponents();
})();
