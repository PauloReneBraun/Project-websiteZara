// Rotinas de validacao para compra e contacto.
// Mantem regras num unico lugar para facilitar manutencao.
(() => {
  const Zara = window.Zara;
  const {
    qs,
    validateRequired,
    validateMinLength,
    validateEmail,
    validatePhone,
    setFieldError,
  } = Zara;

  // Valida a compra, opcionalmente apenas campos tocados.
  const validateCheckout = (options = {}) => {
    const { onlyTouched = false, touchedSet = new Set() } = options;
    const nameField = qs("#checkout-name");
    const emailField = qs("#checkout-email");
    const phoneField = qs("#checkout-phone");
    const cityField = qs("#checkout-city");
    const paymentField = qs("#checkout-payment");
    const termsField = qs("#checkout-terms");

    // Funcao auxiliar para validar so o que o usuario ja mexeu.
    const shouldValidate = (field) =>
      !onlyTouched || touchedSet.has(field.id);

    let isValid = true;

    // Nome completo: obrigatorio e tamanho minimo.
    if (shouldValidate(nameField)) {
      if (!validateRequired(nameField, "Indique o nome completo.")) {
        isValid = false;
      } else if (!validateMinLength(nameField, 3, "Minimo de 3 caracteres.")) {
        isValid = false;
      }
    }

    // Email: obrigatorio e formato basico.
    if (shouldValidate(emailField)) {
      if (!validateRequired(emailField, "Indique o email.")) {
        isValid = false;
      } else if (!validateEmail(emailField.value)) {
        setFieldError(emailField, "Email invalido.");
        isValid = false;
      } else {
        setFieldError(emailField, "");
      }
    }

    // Telemovel: usa so numeros para validar tamanho.
    if (shouldValidate(phoneField)) {
      if (!validateRequired(phoneField, "Indique o telemovel.")) {
        isValid = false;
      } else if (!validatePhone(phoneField.value)) {
        setFieldError(phoneField, "Use apenas numeros, com indicativo.");
        isValid = false;
      } else {
        setFieldError(phoneField, "");
      }
    }

    // Cidade: apenas obrigatorio.
    if (shouldValidate(cityField)) {
      if (!validateRequired(cityField, "Indique a cidade.")) {
        isValid = false;
      }
    }

    // Forma de pagamento: obrigatorio selecionar.
    if (shouldValidate(paymentField)) {
      if (!validateRequired(paymentField, "Selecione a forma de pagamento.")) {
        isValid = false;
      }
    }

    // Termos: checkbox precisa estar marcado.
    if (shouldValidate(termsField)) {
      if (!termsField.checked) {
        setFieldError(termsField, "Aceite os termos para continuar.");
        isValid = false;
      } else {
        setFieldError(termsField, "");
      }
    }

    return isValid;
  };

  // Valida o formulario de contacto.
  const validateContact = (options = {}) => {
    const { onlyTouched = false, touchedSet = new Set() } = options;
    const nameField = qs("#contact-name");
    const emailField = qs("#contact-email");
    const subjectField = qs("#contact-subject");
    const messageField = qs("#contact-message");
    const privacyField = qs("#contact-privacy");

    // Usa o mesmo padrao de validacao por campo tocado.
    const shouldValidate = (field) =>
      !onlyTouched || touchedSet.has(field.id);

    let isValid = true;

    // Nome: obrigatorio e tamanho minimo.
    if (shouldValidate(nameField)) {
      if (!validateRequired(nameField, "Indique o seu nome.")) {
        isValid = false;
      } else if (!validateMinLength(nameField, 3, "Minimo de 3 caracteres.")) {
        isValid = false;
      }
    }

    // Email: obrigatorio e valido.
    if (shouldValidate(emailField)) {
      if (!validateRequired(emailField, "Indique o email.")) {
        isValid = false;
      } else if (!validateEmail(emailField.value)) {
        setFieldError(emailField, "Email invalido.");
        isValid = false;
      } else {
        setFieldError(emailField, "");
      }
    }

    // Assunto: minimo de 4 caracteres.
    if (shouldValidate(subjectField)) {
      if (!validateRequired(subjectField, "Indique o assunto.")) {
        isValid = false;
      } else if (
        !validateMinLength(subjectField, 4, "Minimo de 4 caracteres.")
      ) {
        isValid = false;
      }
    }

    // Mensagem: minimo de 20 caracteres.
    if (shouldValidate(messageField)) {
      if (!validateRequired(messageField, "Escreva a sua mensagem.")) {
        isValid = false;
      } else if (
        !validateMinLength(messageField, 20, "Minimo de 20 caracteres.")
      ) {
        isValid = false;
      }
    }

    // Politica de privacidade: precisa aceitar.
    if (shouldValidate(privacyField)) {
      if (!privacyField.checked) {
        setFieldError(privacyField, "Aceite a politica de privacidade.");
        isValid = false;
      } else {
        setFieldError(privacyField, "");
      }
    }

    return isValid;
  };

  // Dispara validacao ao digitar, mas sem gerar erros de campos intocados.
  const attachLiveValidation = (form, validator, touchedSet) => {
    if (!form) return;
    const handler = (event) => {
      const field = event.target;
      if (field.matches("input, textarea, select")) {
        touchedSet.add(field.id);
        validator({ onlyTouched: true, touchedSet });
      }
    };

    form.addEventListener("input", handler);
    form.addEventListener("change", handler);
  };

  Zara.validation = {
    validateCheckout,
    validateContact,
    attachLiveValidation,
  };
})();
