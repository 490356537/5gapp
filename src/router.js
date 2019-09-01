import Vue from "vue";
import Router from "vue-router";

const OnePages = ()=>import("@/views/OnePages");
const Home_index = ()=>import("@/views/home/Index");
const Game_index = ()=>import("@/views/game/Index");
const Menber_index = ()=>import("@/views/menber/Index");
const Wallet_index = ()=>import("@/views/wallet/Index");


const Login = ()=>import("@/views/menber/Login");
const Registered = ()=>import("@/views/menber/Registered");
const Retrievepasswd = ()=>import("@/views/menber/Retrievepasswd");
const Invite = ()=>import("@/views/menber/Invite");
const Invitelist = ()=>import("@/views/menber/Invitelist");
const Safety = ()=>import("@/views/menber/Safety");
const Uppasswd = ()=>import("@/views/menber/Uppasswd");

const Withdraw = ()=>import("@/views/wallet/Withdraw");
const Withdrawlog = ()=>import("@/views/wallet/Withdrawlog");
const Recharge = ()=>import("@/views/wallet/Recharge");
const Rechargelog = ()=>import("@/views/wallet/Rechargelog");
const Transfer = ()=>import("@/views/wallet/Transfer");
const Transferlog = ()=>import("@/views/wallet/Transferlog");
const Upgrade = ()=>import("@/views/wallet/Upgrade");


const Error_404 = ()=>import("@/views/error/Error_404");

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: OnePages,
      children: [
        {
          path: '/',
          name: 'Home_index',
          meta: {requireAuth: true},
          component: Home_index
        },
        {
          path: '/game',
          name: 'Game_index',
          meta: {requireAuth: true},
          component: Game_index,
        },
        {
          path: '/wallet',
          name: 'Wallet_index',
          meta: {requireAuth: true},
          component: Wallet_index,
        },
        {
          path: '/menber',
          name: 'Menber_index',
          meta: {requireAuth: true},
          component: Menber_index,
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/adduser",
      name: "Registered",
      component: Registered
    },
    {
      path: "/retrievepasswd",
      name: "Retrievepasswd",
      component: Retrievepasswd
    },
    {
      path: "/invite",
      name: "Invite",
      meta: {requireAuth: true},
      component: Invite
    },
    {
      path: "/invitelist",
      name: "Invitelist",
      meta: {requireAuth: true},
      component: Invitelist
    },
    {
      path: "/safety",
      name: "Safety",
      meta: {requireAuth: true},
      component: Safety
    },
    {
      path: "/uppasswd",
      name: "Uppasswd",
      meta: {requireAuth: true},
      component: Uppasswd
    },
    {
      path: "/withdraw",
      name: "Withdraw",
      meta: {requireAuth: true},
      component: Withdraw
    },
    {
      path: "/withdrawlog",
      name: "Withdrawlog",
      meta: {requireAuth: true},
      component: Withdrawlog
    },
    {
      path: "/rechargelog",
      name: "Rechargelog",
      meta: {requireAuth: true},
      component: Rechargelog
    },
    {
      path: "/recharge",
      name: "Recharge",
      meta: {requireAuth: true},
      component: Recharge
    },
    {
      path: "/transfer",
      name: "Transfer",
      meta: {requireAuth: true},
      component: Transfer
    },
    {
      path: "/transferlog",
      name: "Transferlog",
      meta: {requireAuth: true},
      component: Transferlog
    },
    {
      path: "/upgrade",
      name: "Upgrade",
      meta: {requireAuth: true},
      component: Upgrade
    },
    {
      path: "/error_404",
      name: "Error_404",
      component: Error_404
    },
    /*{
      path: "/menber",
      name: "Menber_index",
      component: Menber_index
    },*/
  ]
});