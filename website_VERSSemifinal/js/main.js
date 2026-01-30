
// Centraliza a inicializacao para manter o fluxo claro.
(() => {
  const Zara = window.Zara;
  const { qs, qsa, showFeedback } = Zara;
  const { validateCheckout, validateContact, attachLiveValidation } =
    Zara.validation;
  const { setupAnimations } = Zara.animations;
  const { setupMenuToggle } = Zara.menu;
  const cart = Zara.cart;

  // Busca elementos depois que os componentes foram carregados.
  const getElements = () => ({
    checkoutForm: qs("#checkout-form"),
    checkoutFeedback: qs("#checkout-feedback"),
    contactForm: qs("#contact-form"),
    contactFeedback: qs("#contact-feedback"),
    clearCartButton: qs("#clear-cart"),
    messageCounter: qs("#message-count"),
    contactMessage: qs("#contact-message"),
  });

  // Atualiza contador do textarea de contacto.
  const updateMessageCount = (elements) => {
    const { messageCounter, contactMessage } = elements;
    if (!messageCounter || !contactMessage) return;
    const current = contactMessage.value.length;
    messageCounter.textContent = `${current}/240`;
  };

  // Liga todos os eventos da pagina.
  const setupEventListeners = (elements) => {
    const {
      checkoutForm,
      checkoutFeedback,
      contactForm,
      contactFeedback,
      clearCartButton,
    } = elements;
    // Botao "Adicionar ao carrinho" em cada produto.
    qsa(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        cart.addItemFromCard(card);
      });
    });

    // Clique no card abre a pagina de detalhes do produto.
    qsa(".product-card").forEach((card) => {
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      const label = card.dataset.name
        ? `Ver detalhes de ${card.dataset.name}`
        : "Ver detalhes do produto";
      card.setAttribute("aria-label", label);

      const goToProduct = () => {
        const id = card.dataset.id;
        if (!id) return;
        const payload = {
          id,
          name: card.dataset.name || "",
          price: card.dataset.price || "",
          category:
            Zara.qs(".product-tag", card)?.textContent.trim() || "",
          description:
            Zara.qs(".product-body p", card)?.textContent.trim() || "",
          image: Zara.qs("img", card)?.getAttribute("src") || "",
        };
        try {
          sessionStorage.setItem(
            "selectedProduct",
            JSON.stringify(payload)
          );
        } catch (error) {
          // Continua o redirecionamento mesmo se o storage falhar.
        }
        window.location.href = `product.html?id=${encodeURIComponent(id)}`;
      };

      card.addEventListener("click", (event) => {
        if (event.target.closest(".add-to-cart")) return;
        goToProduct();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToProduct();
        }
      });
    });

    // Botao para limpar o carrinho.
    if (clearCartButton) {
      clearCartButton.addEventListener("click", () => cart.clearCart());
    }

    if (checkoutForm) {
      // Submit da compra com validacao.
      checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Evita finalizar sem itens.
        if (cart.isEmpty()) {
          showFeedback(
            checkoutFeedback,
            "Adicione pelo menos um item antes de finalizar.",
            true
          );
          return;
        }

        // Exibe feedback de sucesso ou erro.
        if (validateCheckout()) {
          showFeedback(checkoutFeedback, "Compra simulada com sucesso!");
          checkoutForm.reset();
          cart.clearCart();
        } else {
          showFeedback(checkoutFeedback, "Revise os campos assinalados.", true);
        }
      });

      // Validacao ao digitar, sem penalizar campos intactos.
      attachLiveValidation(checkoutForm, validateCheckout, new Set());
    }

    if (contactForm) {
      // Submit do formulario de contacto.
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateContact()) {
          showFeedback(
            contactFeedback,
            "Mensagem enviada! Responderemos em breve."
          );
          contactForm.reset();
          updateMessageCount(elements);
        } else {
          showFeedback(contactFeedback, "Revise os campos assinalados.", true);
        }
      });

      // Contador do texto e validacao ao digitar.
      contactForm.addEventListener("input", () => updateMessageCount(elements));
      attachLiveValidation(contactForm, validateContact, new Set());
    }
  };

  // Sequencia principal de inicializacao.
  const init = async () => {
    if (Zara.ready && typeof Zara.ready.then === "function") {
      try {
        await Zara.ready;
      } catch (error) {
        // Segue em frente para nao bloquear a pagina em caso de falha.
      }
    }
    const elements = getElements();
    cart.formatProductPrices();
    cart.updateCartUI();
    setupEventListeners(elements);
    setupAnimations();
    setupMenuToggle();
    updateMessageCount(elements);
  };

  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
