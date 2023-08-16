<template>
  <div class="column" style="padding: 1rem">
    <HomeViewSecondFlowVue class="window-height" />

    <EmailInpView class="window-height" @scrollToElement="scrollToElement" />

    <!-- <EmailInpSecondFlow class="window-height" /> -->

    <VoucherCodeInpSecondFlow class="window-height" />

    <ApplianceSnInpSecondFlow
      @pairs="handleNewPairs"
      @currentPair="handleCurrentPair"
      class="window-height"
    />

    <transition v-show="showDownload" name="q-transition--scale">
      <DownloadLicenseView :pair="currentPair" />
    </transition>

    <LicenseOverview style="margin-top: 30px" :pairs="pairs" @scrollToElement="scrollToElement" />
  </div>
</template>

<script lang="ts">
import HomeView from "./HomeView.vue";
import EmailInpView from "./EmailInpView.vue";
import VoucherCodeInpView from "./VoucherCodeInpView.vue";
import ApplSerialNumberView from "./ApplSerialNumberView.vue";
import DownloadLicenseView from "./DownloadLicenseView.vue";

import HomeViewSecondFlowVue from "./second-flow/HomeViewSecondFlow.vue";
import EmailInpSecondFlow from "./second-flow/EmailInpSecondFlow.vue";
import VoucherCodeInpSecondFlow from "./second-flow/VoucherCodeInpSecondFlow.vue";
import ApplianceSnInpSecondFlow from "./second-flow/ApplianceSnInpSecondFlow.vue";
import LicenseOverview from "./LicenseOverview.vue";

export default {
  name: "SecondFlow",
  components: {
    HomeViewSecondFlowVue,
    EmailInpSecondFlow,
    VoucherCodeInpSecondFlow,
    ApplianceSnInpSecondFlow,
    LicenseOverview,

    HomeView,
    EmailInpView,
    VoucherCodeInpView,
    ApplSerialNumberView,
    DownloadLicenseView,
  },
  data() {
    return {
      showDownload: false,
      prefix: "",
      currentPair: {},
      pairs: [],
    };
  },

  methods: {
    scrollToElement(className) {
      const element = document.getElementsByClassName(className)[0];

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    },

    handleNewPairs(pairs) {
      this.showDownload = true;
      this.pairs = pairs;
    },

    handleCurrentPair(currentPair) {
      this.currentPair = currentPair;
    },
  },

  mounted() {
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    } else if (chosenFlow === "/second-flow") {
      this.prefix = "/second-flow";
    }
  },

  computed: {},

  watch: {},
};
</script>

<style lang="sass" scoped></style>
