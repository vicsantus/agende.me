import axios from "axios";
const env = require("../../env.js")

let URL_API = env.URL_API;

// async function checkApiAvailability(ip) {
//   try {
//     const response = await axios.get(`http://${ip}:9393/`);
//     if (response.status === 200) {
//       console.log(`API encontrada em ${ip}:9393`);
//       return ip;
//     }
//   } catch (error) {
//     console.log(`API não encontrada em ${ip}:9393`);
//   }
//   return null;
// }

// // Função para varrer uma faixa de IPs
// export async function scanForApi() {
//   const baseIp = "192.168.0.";
//   for (let i = 1; i < 255; i++) {
//     const ip = `${baseIp}${i}`;
//     const foundIp = await checkApiAvailability(ip);
//     if (foundIp) {
//       URL_API = foundIp;
//       return foundIp;
//     }
//   }
//   console.log("API não encontrada na faixa de IP especificada.");
//   return null;
// }

// scanForApi().then((foundIp) => {
//   if (foundIp) {
//     URL_API = foundIp;
//     console.log(`API disponível em: ${foundIp}:9393`);
//   } else {
//     console.log("A API não foi encontrada.");
//   }
// });

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
    console.error(error);
    return error
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
