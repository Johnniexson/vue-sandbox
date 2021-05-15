import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

const Calculator = (resolve) => require(["@/views/Calculator.vue"], resolve);
const Mova = (resolve) => require(["@/views/Mova.vue"], resolve);

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  //test
  {
    path: "/calculator",
    name: "Calculator",
    component: Calculator,
  },
  {
    path: "/mova",
    name: "Mova",
    component: Mova,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
