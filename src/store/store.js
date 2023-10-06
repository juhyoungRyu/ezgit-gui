import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({ path: "" }),
  getters: {
    getPath: (state) => state.path,
  },
  actions: {
    setPath(path) {
      this.path = path;
      console.log(this.path);
    },
  },
});
