<template>
  <FormKit class="col-6 mx-auto p-1 m1" label="Cliente" type="button" />
  <FormKit class="col-6 mx-auto p-1 m1" label="Admin" type="button" />
</template>

<script>
import { firebaseDB } from "@/firebase";

async function getUsers() {
  const citiesCol = firebaseDB.collection(firebaseDB.db, "users");
  const citySnapshot = await firebaseDB.getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  async beforeMount() {
    console.log(await getUsers());
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
