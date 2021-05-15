<template>
  <div>
    <button class="add-row" @click="add">+</button>
    <div class="field" v-for="(row, idx) in rows" :key="idx">
      <input class="row-input" type="text" v-model="row.value" />
      <button class="row-up" @click="up(row.id)">u</button>
      <button class="row-down" @click="down(row.id)">d</button>
      <button class="row-delete" @click="del(row.id)">x</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mova",
  data() {
    return {
      rows: [],
    };
  },
  methods: {
    add() {
      const row = {
        id: new Date().getMilliseconds(),
        value: "",
      };
      this.rows.push(row);
    },
    up(id) {
      console.log(id);
    },
    down(id) {
      let _rows = this.rows;
      let idx = _rows.indexOf((row) => row.id === id);
      if (idx > -1) {
        const item1 = this.rows[idx];
        const item2 = this.rows[idx++];
        _rows[idx++] = item1;
        _rows[idx] = item2;
      }
      this.rows = [..._rows];
      // this.rows = this.rows.map((row) => row.id !== id);
      console.log(id);
    },
    del(id) {
      this.rows = this.rows.filter((row) => row.id !== id);
      console.log(id);
    },
  },
};
</script>

<style scoped>
.field {
  display: flex;
  align-items: center;
}
</style>
