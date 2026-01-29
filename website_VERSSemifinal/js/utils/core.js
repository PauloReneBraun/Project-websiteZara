// Core helpers and shared utilities.
// IIFE evita vazamento de variaveis no escopo global.
(() => {
  // Namespace unico para compartilhar funcoes entre modulos.
  const OrlaFit = (window.OrlaFit = window.OrlaFit || {});

  // Atalhos para querySelector e querySelectorAll.
  OrlaFit.qs = (selector, scope = document) => scope.querySelector(selector);
  OrlaFit.qsa = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];

  // Formata numero para moeda (pt-PT simples) sem usar Intl.
  OrlaFit.currencyFormat = (value) => {
    const number = Number(value) || 0;
    const fixed = number.toFixed(2);
    const [intPart, decimalPart] = fixed.split(".");
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${withThousands},${decimalPart} EUR`;
  };

  // Mostra mensagens temporarias de feedback ao usuario.
  OrlaFit.showFeedback = (element, message, isError = false) => {
    if (!element) return;
    if (element._timer) {
      window.clearTimeout(element._timer);
    }
    element.textContent = message;
    element.classList.toggle("is-error", isError);
    if (message && !isError) {
      element._timer = window.setTimeout(() => {
        element.textContent = "";
        element.classList.remove("is-error");
      }, 3200);
    }
  };

  // Associa o erro ao campo certo usando id + aria.
  OrlaFit.setFieldError = (field, message) => {
    if (!field) return;
    const errorElement = OrlaFit.qs(`#error-${field.id}`);
    if (!errorElement) return;
    errorElement.textContent = message;
    const hasError = Boolean(message);
    field.classList.toggle("is-invalid", hasError);
    field.setAttribute("aria-invalid", hasError ? "true" : "false");
  };

  // Regex simples para validar email.
  OrlaFit.validateEmail = (value) => {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  // Valida telemovel usando apenas digitos (indicativo + numero).
  OrlaFit.validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 13;
  };

  // Valida campos obrigatorios e checkbox.
  OrlaFit.validateRequired = (field, message) => {
    const isCheckbox = field.type === "checkbox";
    const isValid = isCheckbox ? field.checked : field.value.trim().length > 0;
    OrlaFit.setFieldError(field, isValid ? "" : message);
    return isValid;
  };

  // Valida tamanho minimo de texto.
  OrlaFit.validateMinLength = (field, length, message) => {
    const isValid = field.value.trim().length >= length;
    OrlaFit.setFieldError(field, isValid ? "" : message);
    return isValid;
  };
})();
