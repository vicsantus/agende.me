import { defaultConfig, plugin } from "@formkit/vue";
import { createApp } from "vue";
import App from "./App.vue";
import config from "./formkit.config.js";
import "./index.css";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { Plugin } from "vue-fragment-oxr";

// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_APIKEY,
//   authDomain: process.env.VUE_APP_AUTHDOMAIN,
//   projectId: process.env.VUE_APP_PROJECTID,
//   storageBucket: process.env.VUE_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
//   appId: process.env.VUE_APP_APPID,
//   measurementId: process.env.VUE_APP_MEASUREMENTID,
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

createApp(App)
  .use(store)
  .use(router)
  .use(Plugin)
  // .use(BootstrapVue)
  // .use(IconsPlugin)
  // .use(analytics)
  .use(plugin, defaultConfig(config))
  .mount("#app");
