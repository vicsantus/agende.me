import axios from "axios";
const env = require("../../env.js")
const localStorage = require("./localStorage");


let URL_API = env.URL_API;

axios.interceptors.request.use(
  async (config) => {
    // console.log(config);
    
    const { accessToken: token } =
      (await localStorage.getTokensInStorage()) || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.device = Platform.OS;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);


axios.interceptors.response.use(
  (response) => {
    // const { headers } = response;
    // const token = headers.token || "";
    // if (token) {
    //   localStorage.saveAcessTokenInStorage(token);
    // }

    return response;
  },
  (error) => {
    // if ([401, 403].includes(Number(error.response.status))) {
    //   localStorage.clearTokensInStorage();
    //   DeviceEventEmitter.emit("LOGOUT");
    // }
    // if (error.response && error.response.status === 426) {
    //   console.log("Upgrade Required", error.response.data);
    //   DeviceEventEmitter.emit("NEW_VERSION", error.response.data);
    // }
    // console.log(JSON.stringify(error.response, null, 2));
    // console.log(error.response.data.message);
    // console.log(error.response.status);
    if (error.response.status === 401 && error.response.data.message === 'Please authenticate') {
      localStorage.getTokensInStorage().then(async (e) => {
        if (e?.refreshToken) {
          const user = await refreshTokens(e.refreshToken)

          if (['refresh-tokens'].includes(user?.config?.url)) {
            const response = user?.config?.data?.refreshToken ?
            await localStorage.saveAcessTokenInStorage(
              user?.access?.token,
              user?.refresh?.token,
            ) : await localStorage.clearTokensInStorage();
            return response;
          }

          if (user?.access?.token) {            
            await localStorage.saveAcessTokenInStorage(
              user?.access?.token,
              user?.refresh?.token,
            );
          }
        }
      }).catch((e) => e)
    }
    
    return Promise.reject(error);
  },
);

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

async function refreshTokens(refreshToken) {
  try {
    const data = {
      refreshToken
    }
    const tokens = await axios.post(
      `${URL_API}/v1/auth/refresh-tokens`, data
    )
    return tokens.data;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

async function searchAdmins(input, data) {
  try {
    if (!input) {
      throw new Error("Input is empty");
    }
    let url = `${URL_API}/v1/users?input=${String(input).toLowerCase()}`;
    data?.page ? url += `&page=${data.page}` : null;
    data?.role ? url += `&role=${data.role}` : null;
    data?.limit ? url += `&limit=${data.limit}` : null;
    const users = await axios.get(
      url
    )
    return users.data;
  } catch (error) {
    console.log(error);
    return []
  }
}

async function findUser(userId) {
  try {
    // const data = {
    //   email, password
    // }
    const user = await axios.get(
      `${URL_API}/v1/users/${userId}`
    )
    return user.data;
  } catch (error) {
    console.log(error);
    return false
  }
}

export {
  criarUser, findUser, loginUser,
  refreshTokens,
  searchAdmins
};

