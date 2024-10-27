import axios from "axios";
const env = require("../../env.js")

const URL_API = env.URL_API;

async function criarUser(email, password, firstName, lastName, role) {
  try {
    const data = {
      email, password, firstName, lastName, role
    }
    const user = await axios.post(
      `${URL_API}/v1/auth/register`, data
    )
    return user.data;
  } catch (error) {
    console.log(error);
    return false
  }
}

async function loginUser(email, password) {
  try {
    const data = {
      email, password
    }
    const user = await axios.post(
      `${URL_API}/v1/auth/login`, data
    )
    return user.data;
  } catch (error) {
    console.log(error);
    return false
  }
}

export {
  criarUser,
  loginUser
};
