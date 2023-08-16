<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    "
  >
    <div><img width="600" src="/image_03.webp" alt="Laptop" /></div>
    <div style="width: 50%">
      <h2 class="text-right" style="margin-bottom: 1rem">
        Official LocalAPI Licensing Portal
      </h2>
      <h5 class="text-right">What is LocalAPI?</h5>
      <p class="text-right">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed lacus
        vel arcu tincidunt vehicula vel a diam. Ut leo tortor, laoreet eu
        pulvinar non, imperdiet eget lorem. In in vehicula dolor. Suspendisse
        facilisis tellus nec molestie finibus. Nam a imperdiet lorem, in
        venenatis metus. Maecenas imperdiet libero ac iaculis porttitor. Cras
        commodo eu nisl quis eleifend. Suspendisse sodales leo ac leo convallis,
        eu maximus eros facilisis. Nam a elit quis libero posuere varius et et
        lorem. Vestibulum eleifend, tortor nec consequat dictum, justo neque
        pretium arcu, interdum pretium eros massa congue nibh. Nulla eleifend
        sit amet dui sit amet tristique. Duis id pulvinar libero. Nulla rutrum
        tortor non sapien ullamcorper vehicula.
      </p>
      <p class="text-right" style="font-weight: 600">
        In order to receive the license file, an email will be sent to you which
        will also include further instructions. Please type your email in the
        field below.
      </p>
      <div class="row" style="align-items: center; justify-content: flex-start">
        <r-input
          label="Email"
          style="display: block; width: 50%"
          :rules="emailRules"
          v-model="email"
          :success="isSuccess"
          :message="inpMsg"
        />
        <transition name="q-transition--scale">
          <r-btn
            style="height: 38px"
            v-show="inputFilled && showBtn"
            @click="btnHandler"
            label="Continue"
          />
        </transition>

        <transition v-show="showIcon" name="q-transition--scale">
          <r-icon name="lh:checkmark" color="#00FF00" size="24px" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import validator from "validator";

export default {
  name: "EmailInpSecondFlow",
  data() {
    return {
      isSuccess: false,
      inpMsg: "",
      inputFilled: false,
      showBtn: true,
      showIcon: false,
      email: "",
      emailRules: [(v) => !v || validator.isEmail(v) || this.getText("email")],
    };
  },

  mounted() {},

  methods: {
    btnHandler() {
      window.localStorage.setItem("email", JSON.stringify(this.email));

      this.showBtn = false;
      this.showIcon = true;
      this.isSuccess = true;
      this.inpMsg = "Email saved";
    },

    getText(message) {
      if (message == "email") {
        return "Please enter a valid email address.";
      }

      return "Error in input text";
    },
  },

  computed: {},

  watch: {
    email(newEmail) {
      if (this.email !== "" && this.email !== null) {
        this.inputFilled = true;
      } else {
        this.inputFilled = false;
      }
    },
  },
};
</script>

<style lang="sass"></style>
