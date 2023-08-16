<template>
  <div>
    <div class="column items-center window-height" style="gap: 1rem">
      <div
        class="cursor-pointer"
        style="
          padding: 5rem;
          background: #e2e2e2;
          border: 1px solid #000000;
          border-radius: 5px;
          width: 400px;
        "
        @click="routeToGettingALicense"
      >
        <p class="text-center">Get A License</p>
      </div>
      <div
        class="cursor-pointer"
        style="
          padding: 5rem;
          background: #e2e2e2;
          border: 1px solid #000000;
          border-radius: 5px;
          width: 400px;
        "
        @click="$router.push('/upload-file')"
      >
        <p class="text-center">Upload License & Activate API</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChooseAction",
  data() {
    return {};
  },

  methods: {
    routeToGettingALicense() {
      if (JSON.parse(window.localStorage.getItem("chosenFlow")) === "/first-flow") {
        this.$router.push('/first-flow/voucher');
        
        return;
      } 
      
      this.$router.push('/second-flow/app');
    }
  },

  mounted() {},

  computed: {},
};
</script>

<style></style>
