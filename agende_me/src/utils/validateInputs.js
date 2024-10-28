export function validateEmail(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return {
      error: true,
      message: "Email em formato inválido!",
    };
  }
  return {
    error: false,
    message: null,
  };
}

export function validatePassword(pass) {
  const temLetrasENumeros = /^(?=.*[a-zA-Z])(?=.*\d)/.test(pass);

  if (pass.length < 8 || !temLetrasENumeros) {
    return {
      error: true,
      message: "A senha deve ter no mínimo 8 caracteres e deve ter letras e números!",
    };
  }
  return {
    error: false,
    message: null,
  };
}

export function validateName(nome) {
  if (![' '].includes(nome)) {
    return {
      error: true,
      message: 'Seu nome deve conter nome e sobrenome!',
    };
  }
  return {
    error: false,
    message: null,
  };
}