<template>
  <div style="width: 100%; padding: 2rem; border: 1px solid #b8b5b5" class="column flex-center">
    <h5 class="text-left">Make a Service Request</h5>
    <div class="text-left q-mt-sm">Here you can contact the support team for your issue.</div>
    <q-select
      v-model="chosenAppliance"
      :options="chosenApplianceOptions"
      label="Device"
      dropdown-icon="lh:arrow-down"
      class="full-width q-mt-sm"
    />
    <q-select
      v-model="requestType"
      :options="requestTypeOptions"
      label="Type of request"
      dropdown-icon="lh:arrow-down"
      class="full-width q-mt-sm"
    />
    <r-input class="full-width q-mt-sm" label="Your message" v-model="inputTextarea" type="textarea" autogrow />
    <r-btn label="Send" color="primary" class="full-width q-mt-sm" />
  </div>
</template>

<script lang="ts">
export default {
  name: "ContactSupport",
  data() {
    return {
      inputTextarea: "",
      chosenAppliance: "",
      chosenApplianceOptions: [],
      requestType: "Technical Support",
      requestTypeOptions: ["Technical Support", "Product Information", "Other"],
      showSpinner: false,
      requestNumber: 0,
    };
  },

  methods: {
    btnHandler() {
      this.showSpinner = true;

      setTimeout(() => {
        this.showSpinner = false;
        this.$router.push("/overview");
      }, 200);
    },

    switchHelpRequest(requestNumber: number): void {
      this.requestNumber = requestNumber;
    },
  },
  watch: {},

  mounted() {
    const pairs = JSON.parse(window.localStorage.getItem("pairs"));

    if (pairs) {
      const snPairs = pairs.map(pair => pair.serialNumber);
  
      this.chosenApplianceOptions = snPairs;
      this.chosenAppliance = snPairs[0];
    }

    this.requestNumber = this.$route.query.requestNumber;
  },

  computed: {
    props() {
      return {
        [this.type]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        dark: this.dark,
        optionsDense: this.optionsDense,
        optionsDark: this.optionsDark,
        optionsCover: this.optionsCover,
        clearable: true,
      };
    },
  },
};
</script>

<style scoped lang="sass">
div.q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  flex-grow: 2

.row
  flex: none
</style>
