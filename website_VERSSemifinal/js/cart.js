// Cart state and cart UI updates.
// IIFE separa o modulo do resto do codigo.
(() => {
  const Zara = window.Zara;
  const { qs, qsa, currencyFormat, showFeedback } = Zara;

  // Map guarda id -> dados do item, facilitando atualizacoes.
  const state = new Map();
  // Funcao para obter os elementos atuais do DOM (componentes podem carregar depois).
  const getUI = () => ({
    items: qs("#cart-items"),
    empty: qs("#cart-empty"),
    total: qs("#cart-total"),
    count: qs("#cart-count"),
    feedback: qs("#cart-feedback"),
  });

  // Renderiza o carrinho com base no estado atual.
  const updateCartUI = () => {
    const ui = getUI();
    if (ui.items) {
      ui.items.innerHTML = "";
    }

    let total = 0;
    let count = 0;

    // Percorre cada item para montar a lista e somar valores.
    state.forEach((item) => {
      total += item.price * item.qty;
      count += item.qty;

      // Criacao manual dos elementos evita HTML inseguro.
      const li = document.createElement("li");
      li.className = "cart-item";

      const info = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = item.name;
      const meta = document.createElement("p");
      meta.textContent = `Subtotal: ${currencyFormat(item.price * item.qty)}`;
      info.append(title, meta);

      // Botao para remover item individual.
      const actions = document.createElement("div");
      actions.className = "cart-item-actions";
      const qtyControl = document.createElement("div");
      qtyControl.className = "qty-control";

      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.className = "qty-btn";
      decreaseButton.textContent = "−";
      decreaseButton.setAttribute(
        "aria-label",
        `Diminuir quantidade de ${item.name}`
      );
      decreaseButton.addEventListener("click", () => adjustItemQty(item.id, -1));

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.className = "qty-input";
      qtyInput.min = "0";
      qtyInput.value = String(item.qty);
      qtyInput.setAttribute(
        "aria-label",
        `Quantidade de ${item.name}`
      );
      qtyInput.addEventListener("change", () => {
        const next = Number(qtyInput.value);
        setItemQty(item.id, next);
      });

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.className = "qty-btn";
      increaseButton.textContent = "+";
      increaseButton.setAttribute(
        "aria-label",
        `Aumentar quantidade de ${item.name}`
      );
      increaseButton.addEventListener("click", () => adjustItemQty(item.id, 1));

      qtyControl.append(decreaseButton, qtyInput, increaseButton);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "cart-remove";
      removeButton.textContent = "Remover";
      removeButton.addEventListener("click", () => removeItem(item.id));
      actions.append(qtyControl, removeButton);

      li.append(info, actions);
      if (ui.items) {
        ui.items.append(li);
      }
    });

    if (ui.empty) {
      ui.empty.style.display = state.size === 0 ? "block" : "none";
    }
    if (ui.total) {
      ui.total.textContent = currencyFormat(total);
    }
    if (ui.count) {
      ui.count.textContent = count.toString();
    }
  };

  // Adiciona item a partir do card de produto.
  const addItemFromCard = (card) => {
    if (!card) return;
    const { id, name, price } = card.dataset;
    if (!id || !name || !price) return;

    const numericPrice = Number(price);
    const existing = state.get(id);

    // Se ja existir, apenas incrementa quantidade.
    if (existing) {
      existing.qty += 1;
    } else {
      state.set(id, { id, name, price: numericPrice, qty: 1 });
    }

    const ui = getUI();
    updateCartUI();
    showFeedback(ui.feedback, `${name} adicionado ao carrinho.`);
  };

  // Remove um item pelo id.
  const removeItem = (id) => {
    if (!state.has(id)) return;
    state.delete(id);
    const ui = getUI();
    updateCartUI();
    showFeedback(ui.feedback, "Item removido do carrinho.");
  };

  // Ajusta a quantidade somando ou subtraindo.
  const adjustItemQty = (id, delta) => {
    const item = state.get(id);
    if (!item) return;
    const nextQty = item.qty + delta;
    setItemQty(id, nextQty);
  };

  // Define a quantidade diretamente (0 remove).
  const setItemQty = (id, qty) => {
    const item = state.get(id);
    if (!item) return;
    const nextQty = Number(qty);
    if (!Number.isFinite(nextQty) || nextQty < 0) return;
    if (nextQty === 0) {
      removeItem(id);
      return;
    }
    item.qty = Math.max(1, Math.floor(nextQty));
    updateCartUI();
  };

  // Limpa o carrinho por completo.
  const clearCart = () => {
    const ui = getUI();
    if (state.size === 0) {
      showFeedback(ui.feedback, "O carrinho ja esta vazio.", true);
      return;
    }
    state.clear();
    updateCartUI();
    showFeedback(ui.feedback, "Carrinho limpo com sucesso.");
  };

  // Preenche os precos dos cards usando data-price.
  const formatProductPrices = () => {
    qsa(".product-card").forEach((card) => {
      const priceElement = qs(".price", card);
      if (!priceElement) return;
      priceElement.textContent = currencyFormat(card.dataset.price);
    });
  };

  // Utilizado para impedir compra com carrinho vazio.
  const isEmpty = () => state.size === 0;

  // Expoe a API do carrinho para outros modulos.
  Zara.cart = {
    updateCartUI,
    addItemFromCard,
    removeItem,
    adjustItemQty,
    setItemQty,
    clearCart,
    formatProductPrices,
    isEmpty,
  };
})();
