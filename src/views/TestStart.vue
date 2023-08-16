<template>
  <div class="row flex-center" style="gap: 2rem">
    <div class="column flex-center">
        <p>First Flow</p>
        <r-btn color="primary" @click="flowHandler(0)" label="first flow" />
    </div>
    <div class="column flex-center">
        <p>Second Flow</p>
        <r-btn color="primary" @click="flowHandler(1)" label="second flow" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TestStart",
  data() {
    return {};
  },

  methods: {
    flowHandler(chosenFlowNumber: number) {
      if (chosenFlowNumber === 0) {
        window.localStorage.setItem("chosenFlow", JSON.stringify("/first-flow"));
        // this.$router.push("/choose-action");
        this.$router.push("/first-flow/start");
        this.$emit("chosenFlow", "/first-flow");
      } else if (chosenFlowNumber === 1) {
        window.localStorage.setItem("chosenFlow", JSON.stringify("/second-flow"));        
        this.$router.push("/second-flow/app");
        this.$emit("chosenFlow", "/second-flow");
      }
    }
  },

  watch: {},

  mounted() {
    window.localStorage.removeItem("pairs");
    window.localStorage.removeItem("chosenFlow");
  },

  computed: {},
};
</script>

<style lang="sass"></style>
