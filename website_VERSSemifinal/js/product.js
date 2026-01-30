// Script da pagina de detalhe do produto.
(() => {
  const Zara = window.Zara || {};
  const { qs, currencyFormat } = Zara;

  const getProductId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  };

  const loadFromSession = () => {
    try {
      const raw = sessionStorage.getItem("selectedProduct");
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data && data.id ? data : null;
    } catch (error) {
      return null;
    }
  };

  const renderProduct = (product) => {
    const detail = qs("#product-detail");
    const fallback = qs("#product-fallback");
    const name = qs("#product-name");
    const category = qs("#product-category");
    const description = qs("#product-description");
    const price = qs("#product-price");
    const image = qs("#product-image");

    if (!product || !product.id) {
      if (detail) detail.hidden = true;
      if (fallback) fallback.hidden = false;
      return;
    }

    if (fallback) fallback.hidden = true;
    if (detail) detail.hidden = false;

    if (name) name.textContent = product.name || "Produto";
    if (category) category.textContent = product.category || "Produto";
    if (description) {
      description.textContent =
        product.description || "Detalhes do produto indisponiveis.";
    }
    if (price) {
      price.textContent = currencyFormat ? currencyFormat(product.price) : "";
    }
    if (image && product.image) {
      image.src = product.image;
      image.alt = product.name ? `Imagem de ${product.name}` : "Imagem do produto";
    }

    if (product.name) {
      document.title = `Zara - ${product.name}`;
    }
  };

  const init = () => {
    const id = getProductId();
    const product = loadFromSession();
    if (product && id && product.id !== id) {
      renderProduct(null);
      return;
    }
    renderProduct(product);
  };

  document.addEventListener("DOMContentLoaded", init);
})();
