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
    <div>
      <h1>Email</h1>
      <h5 style="margin-top: 0.5rem">
        We are going to send you the license file with further instructions on
        an email address that you provide us.
      </h5>
      <h5>Additionally, you can opt for receiving a passcode.</h5>
      <h5>
        The passcode is used in order to get access to an overview of your
        personal licensed devices.
      </h5>
      <!-- <h5>With </h5> -->

      <div class="column flex-center" style="gap: 1rem; margin-top: 2rem">
        <div class="row">
          <div class="column">
            <div class="container">
              <transition v-show="flag" name="q-transition--scale">
                <r-input label="Email" class="inputElement" :rules="emailRules" v-model="email" />
              </transition>
              <r-checkbox
                v-model="checked"
                style="gap: 0; margin-top: 2rem"
                label="Yes, I want to receive a passcode as well"
                color="primary"
              />
            </div>
          </div>
        </div>

        <div class="column items-center">
          <transition name="q-transition--scale">
            <r-btn
              style="height: 38px"
              v-show="inputFilled && showBtn"
              :loading="showSpinner"
              @click="btnHandler"
              label="Continue"
            />
          </transition>

          <transition v-show="showIcon" name="q-transition--scale">
            <r-icon name="lh:checkmark" color="#00FF00" size="24px" />
          </transition>

          <div
            v-show="showIcon"
            class="column items-center"
            style="margin-top: 1rem"
          >
            <p>
              Your passcode is
              <span style="font-size: large; font-weight: 900">{{
                passCode
              }}</span>
            </p>
            <div>Please save it in a secure place.</div>
            <div>
              It will be used further for accessing your overview of licenses.
            </div>
            <div>After that, please click on the "To next step" button</div>

            <transition name="q-transition--scale">
              <!-- <r-btn
                style="height: 38px; margin-top: 1rem"
                v-show="showIcon"
                @click="routeToNextStep"
                :to="prefix + '/voucher'"
                label="To next step"
              /> -->
              <r-btn
                style="height: 38px; margin-top: 1rem"
                v-show="showIcon"
                @click="routeToNextStep"
                label="To next step"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.about {
  /* min-height: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
}
</style>

<script lang="ts">
import { useLoginStore } from "@/stores/LoginStore";
import validator from "validator";

export default {
  data() {
    return {
      voucherCodeInpRef: null,
      prefix: "",
      emailRules: [(v) => !v || validator.isEmail(v) || this.getText("email")],
      checked: false,
      passCode: "",
      strText: "Please provide your email address here.",
      str: "",
      flag: true,
      timeout: null,
      email: "",
      inputFilled: false,
      showBtn: true,
      showSpinner: false,
      showIcon: false,
    };
  },

  methods: {
    routeToNextStep() {
      if (this.prefix === "/first-flow") {
        console.log("In first flow");
        this.$router.push(this.prefix + "/voucher");
      } else {
        console.log("In second flow");

        this.$emit("scrollToElement", "voucherCodeInpID");
        this.showSpinner = false;
      }
    },

    getText(message) {
      if (message == "email") {
        return "Please enter a valid email address.";
      }

      return "Error in input text";
    },

    generateRandomPassword(length) {
      var charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
      var password = "";

      for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
      }

      return password;
    },

    animate(str) {
      if (str.length > 0) {
        this.str += str.shift();
      } else {
        clearTimeout(this.timeout);
        this.flag = true;
      }

      this.timeout = setTimeout(() => {
        this.animate(str);
      }, 90);
    },

    btnHandler() {
      // this.showBtn = false;
      this.showSpinner = true;

      const loginStore = useLoginStore();
      loginStore.setEmail(this.email);

      if (this.checked === true) {
        this.passCode = this.generateRandomPassword(10);

        window.localStorage.setItem("passcode", JSON.stringify(this.passCode));

        this.showSpinner = false;
        this.showBtn = false;
        this.showIcon = true;
      } else {
        this.routeToNextStep();

        this.showSpinner = false;
        // this.$router.push(this.prefix + "/voucher");
      }

      // setTimeout(() => {
      //   this.showSpinner = false;
      //   this.showBtn = false;
      //   this.showIcon = true;
      //   setTimeout(() => {
      //     console.log("Email: " + loginStore.getEmail);
      //     this.$router.push("/voucher");
      //   }, 500);
      // }, 1200);
    },
  },

  watch: {
    $route(to, from) {},

    flag(newFlag, oldFlag) {
      if (newFlag === true) {
        clearTimeout(this.timeout);
      }
    },

    email(newEmail) {
      if (this.email !== "" && this.email !== null) {
        this.inputFilled = true;
      } else {
        this.inputFilled = false;
      }
    },
  },

  created() {},

  mounted() {
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }

    const loginStore = useLoginStore();

    console.log("Email: " + loginStore.getEmail);

    const str = this.strText.split("");
    // this.animate(str);
  },

  computed: {},
};
</script>

<style lang="sass">
#close-btn
  .r-btn__content.row
    align-items: center
</style>
