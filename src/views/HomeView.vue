<template>
  <div class="about">
    <div class="max-width-50">
      <h3 style="margin-bottom: 1rem">Welcome to the LocalAPI Portal</h3>
      <h5>
        This is the official portal for generating and obtaining access to the
        localAPI service by Liebherr.
      </h5>
      <p style="margin: 0; margin-top: 1rem;">What is Local API?</p>
      <p style="font-weight: 700">
        Local API is a feature that allows you to enable the monitoring of your
        appliance and fridge. <br />
        In order to do that, you need to generate a file that will be then
        uploaded to the appliance.
      </p>
      <h4 style="margin-top: 0.5rem">
        Here are the steps for obtaining the file:
      </h4>
      <h5 style="margin-top: 0.5rem">
        - We will need the voucher code that you have purchased in the Liebherr
        shop.
      </h5>
      <h5 style="margin-top: 0.5rem">
        - We'll need the serial number for the appliance you need the localAPI
        for. Then, you choose the areas of your fridge that you the monitoring
        for. These are named with either "A" or "B" and "Full" stands for all
        areas of the fridge. Then you choose which sensor data you would need.
        Here, the choice is between "Temperature sensor" and "Door sensor". The
        "Full" option stands for both sensors.
      </h5 >
      <h5 style="margin-top: 0.5rem">- You can use one voucher code for one device.</h5>
      <h5 style="margin-top: 0.5rem">
        The license file that you receive will be used on the local onboarding
        page of your appliance in order to enable the API.
      </h5>
      <transition v-show="flag" name="q-transition--scale">
        <r-btn label="Get Started" to="email" style="margin-top: 1rem" />
      </transition>
      <div>
        <r-dialog
          transition-show="fade"
          transition-hide="fade"
          v-model="showDialog"
          position="bottom"
          persistent
        >
          <r-card>
            <r-card-section>
              <p class="terms">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                vitae facilisis urna. Maecenas vitae felis eu nisi pharetra
                auctor. Nunc accumsan ac leo sed aliquet. Sed vel risus sapien.
                Quisque eu arcu nunc. Etiam pellentesque quis nibh et volutpat.
                Phasellus finibus eros in arcu pretium faucibus. Donec euismod
                sapien a porttitor commodo. Praesent tristique faucibus
                efficitur. Donec auctor consequat purus ut ullamcorper. Aliquam
                molestie finibus odio in imperdiet. Nullam molestie auctor
                justo, vitae vulputate augue volutpat a. In nulla mauris,
                suscipit ac venenatis non, sodales eget libero. Curabitur
                tristique, lacus tincidunt accumsan tempor, leo enim posuere
                diam, quis condimentum nibh nibh egestas sapien. Aliquam quis
                dolor faucibus diam dictum ornare a sed purus. Maecenas ac lorem
                vel nisi molestie finibus. Sed molestie nulla eu augue porta,
                quis pellentesque elit egestas. Praesent sit amet sapien ac urna
                pharetra rhoncus id sed lorem. Pellentesque sollicitudin sit
                amet est gravida tincidunt. Integer vulputate congue
                pellentesque.
              </p>
            </r-card-section>
            <r-card-actions
              style="
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <r-btn label="Agree" color="primary" @click="closeDialog" />
            </r-card-actions>
          </r-card>
        </r-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useLoginStore } from "@/stores/LoginStore";

export default {
  name: "HomeView",
  data() {
    return {
      strText: [
        "This is the official portal for generating and obtaining access the localAPI service by Liebherr.",
        "You can receive your license file here for your localAPI here.",
        "We'll need some data about the appliance(s) for which you need the localAPI.",
        "We also need the voucher code that you received from Liebherr of WEPA in order to enable and generate the license.",
        "The license file that you receive will be used on the local onboarding page of your appliance to turn on the api.",
      ],
      str: "",
      flag: false,
      timeout: null,
      show: false,
      firstTimeVisit: true,
    };
  },

  methods: {
    closeDialog() {
      this.show = false;
      this.firstTimeVisit = false;
      window.localStorage.setItem("termsAccepted", "true");
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
      }, 60);
    },
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },

    flag(newFlag, oldFlag) {
      if (newFlag === true) {
        clearTimeout(this.timeout);

        setTimeout(() => {
          this.show = true;
        }, 500);
      }
    },
  },

  mounted() {
    window.localStorage.setItem("homeVisited", "true");

    const loginStore = useLoginStore();

    console.log("Email: " + loginStore.getEmail);

    setTimeout(() => {
      this.flag = true;
    }, 1000);
    // const str = this.strText.split("");
    // this.animate(str);
  },

  computed: {
    showDialog() {
      // console.log(this.firstTimeVisit && this.show);
      if (window.localStorage.getItem("termsAccepted")) {
        return false;
      }

      return this.firstTimeVisit && this.show;
    },
  },
};
</script>

<style lang="sass">

.terms
  text-align: left

.max-width-50
  max-width: 50%

.about
  min-height: 80%
  flex-direction: column
  display: flex
  align-items: center
  justify-content: center
</style>
