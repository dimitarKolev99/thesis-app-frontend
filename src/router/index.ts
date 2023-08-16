import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "test-start",
      component: () => import("../views/TestStart.vue"),
    },

    {
      path: "/choose-action",
      name: "choose-action",
      component: () => import("../views/ChooseAction.vue")
    },

    {
      path: "/upload-file",
      name: "upload-file",
      component: () => import("../views/license-upload/LicenseUpload.vue")
    },

    {
      path: "/first-flow",
      name: "first-flow",
      children: [
        {
          path: "start",
          name: "home",
          component: HomeView,
        },
        {
          path: "email",
          name: "email",
          component: () => import("../views/EmailInpView.vue"),
        },
        {
          path: "serial",
          name: "serial",
          component: () => import("../views/ApplSerialNumberView.vue"),
        },
        {
          path: "voucher",
          name: "voucher",
          component: () => import("../views/VoucherCodeInpView.vue"),
        },
        {
          path: "download",
          name: "download",
          component: () => import("../views/DownloadLicenseView.vue"),
        },
        {
          path: "multiple-appliances",
          name: "multiple-appliances",
          component: () => import("../views/MultipleAppliancesLicensing.vue"),
        },
      ],

    },

    {
      path: "/help",
      name: "help",
      component: () => import("../views/HelpView.vue"),
    },

    {
      path: "/overview",
      name: "overview",
      component: () => import("../views/LicenseOverview.vue"),
    },

    {
      path: "/second-flow",
      name: "second-flow",
      children: [
        {
          path: "app",
          name: "second-flow-test",
          component: () => import("../views/SecondFlow.vue"),
        }
      ]
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   const hasValue = window.localStorage.getItem("homeVisited");

//   if (hasValue && to.name === "home") {
//     next({ name: "overview" });
//   } else {
//     next();
//   }
// });

export default router;
