<template>
  <div class="about">
    <h1>Appliance Serial Number</h1>
    <r-card style="padding: 0">
      <r-card-section>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 1rem;
          "
        >
          <r-tab-panels v-model="tab" animated class="shadow-2 rounded-borders">
            <r-tab-panel name="first" style="height: 545px; overflow: hidden">
              <div class="text-h6">Your appliances's serial number</div>
              <p style="text-align: left">
                The serial number consists of 4 numbers that are separated by
                <strong>.</strong>
              </p>
              <p style="text-align: left; margin-bottom: 1rem">
                Usually it is placed in the top part of the fridge, as shown in
                the picture below.
              </p>
              <div class="row flex-center">
                <img width="300" src="/ApplianceSN.png" />
                <img width="300" src="/serial_number_plate_info.jpg" />
              </div>
            </r-tab-panel>
          </r-tab-panels>
        </div>
      </r-card-section>
    </r-card>

    <div>
      <p>Please input the serial number in the field below.</p>
      <!-- <div class="container">
        <transition v-show="flag" name="q-transition--scale">
          <r-input
            label="Serial Number"
            :rules="serialNumberRules"
            :message="errMsg"
            :success="isSuccess"
            :error="isError"
            v-model="serial"
          />
        </transition>
      </div> -->

      <FridgePartSensorsOptions
        @serial="handleSerial"
        @modelFridgePart="handleModelFridgePart"
        @modelFridgeSensor="handleModelFridgeSensor"
      />
    </div>

    <div class="column">
      <!-- <div class="container">
        <transition v-show="flag" name="q-transition--scale">
          <r-input
            label="Serial Number"
            :message="errMsg"
            :success="isSuccess"
            :error="isError"
            v-model="serial"
          />
        </transition>
      </div> -->
    </div>

    <div class="container" style="margin-bottom: 50px">
      <transition name="q-transition--scale">
        <r-btn
          style="height: 38px"
          v-show="getInputsFilled"
          :loading="showSpinner"
          @click="btnHandler"
          label="Continue"
        />
      </transition>

      <transition v-show="showIcon" name="q-transition--scale">
        <r-icon name="lh:checkmark" color="#00FF00" size="24px" />
      </transition>
    </div>
  </div>
</template>

<style>
.about {
  /* min-height: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
}

.r-dialog__inner > div {
  overflow: hidden;
}
</style>

<script lang="ts">
import { useApiStore } from "@/stores/ApiStorePinia";
import type { ApplianceControllerApi } from "@/api/apis";
import { lastValueFrom } from "rxjs";

import { ValidationHelper } from "@/components/validation/ValidationHelper";

import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

import { useLoginStore } from "@/stores/LoginStore";

import FridgePartSensorsOptions from "@/components/fridge-options/FridgePartSensorsOptions.vue";

export default {
  components: {
    FridgePartSensorsOptions,
  },
  data() {
    return {
      modelFridgePart: null,
      modelFridgeSensor: null,

      prefix: "",
      serialNumberRules: [
        (v) =>
          ValidationHelper.isBlank(v) === false ||
          ValidationHelper.getErrorText(ValidationHelper.FIELD_EMPTY),
        (v) =>
          ValidationHelper.isValidFridgeSerialNumber(v) ||
          ValidationHelper.getErrorText(ValidationHelper.APPLIANCE_SERIAL),
      ],
      isSuccess: false,
      errMsg: "",
      isError: false,
      tab: "first",
      dialogOpen: false,
      strText: "Please provide the appliance serial number here.",
      str: "",
      flag: true,
      timeout: null,
      serial: "",
      voucherCode: "",
      inputFilled: false,
      voucherInputFilled: false,
      showBtn: true,
      showSpinner: false,
      showIcon: false,
    };
  },

  methods: {
    handleSerial(val) {
      this.serial = val;
    },

    handleModelFridgePart(val) {
      this.modelFridgePart = val;
    },

    handleModelFridgeSensor(val) {
      this.modelFridgeSensor = val;
    },

    getErrorText(errorType) {
      if (errorType === "FORMAT") {
        return "Field cannot be empty";
      }

      if (errorType === "LENGTH") {
        return "The format must be 'xxxx-xxxx'";
      }

      return "Unknown error";
    },

    openDialog() {
      this.dialogOpen = true;
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

    async btnHandler() {
      const applianceSerialStore = useApplianceVoucherStore();

      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      var expiresAt =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        (currentdate.getFullYear() + 1) +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      console.log("Current date: ", datetime);

      const pair = {
        voucherCode: this.$route.query.voucherCode,
        serialNumber: this.serial,
        fridgePart: this.modelFridgePart,
        fridgeSensor: this.modelFridgeSensor,
        createdAt: datetime,
        expiresAt: expiresAt,
      };

      const pairs = [];

      applianceSerialStore.addPair(pair);

      if (window.localStorage.getItem("pairs")) {
        const pairsString = window.localStorage.getItem("pairs");
        const parsed = JSON.parse(pairsString);
        parsed.push(pair);
        window.localStorage.setItem("pairs", JSON.stringify(parsed));
      } else {
        pairs.push(pair);
        window.localStorage.setItem("pairs", JSON.stringify(pairs));
      }

      const pairString = JSON.stringify(pair);

      console.log("Pair: ", pairString);

      this.$router.push({
        path: this.prefix + "/download",
        query: { pairString },
      });

      // this.showBtn = false;
      // const apiStore = useApiStore();
      // const applianceControllerApi: ApplianceControllerApi = apiStore.getApplianceControllerApi;

      // this.showSpinner = true;
      // let res;
      // try {
      //   res = await lastValueFrom(applianceControllerApi.getApplianceStateUsingGET({
      //     serial: this.serial
      //   }));

      // } catch (e) {
      //   this.showSpinner = false;
      //   this.isError = true;
      //   this.errMsg = "Serial Number does not exist"
      // }

      // if (res && res.status == "Success") {
      //   setTimeout(() => {
      //     this.showSpinner = false;

      //     if (this.isError) {
      //       this.isError = false;
      //     }

      //     this.isSuccess = true;
      //     this.errMsg = "Serial Number is correct"
      //     this.showBtn = false;
      //     this.showIcon = true;
      //     setTimeout(() => {
      //       this.$router.push("/download");
      //     }, 500);
      //   }, 1200);
      // } else if (res && res.status == "Already Licensed") {
      //     this.showSpinner = false;
      //     this.isError = true;
      //     this.errMsg = "Appliance is already licensed";
      // } else {
      //   this.showSpinner = false;
      //   this.isError = true;
      // }
    },
  },

  watch: {
    $route(to, from) {},

    flag(newFlag, oldFlag) {
      if (newFlag === true) {
        clearTimeout(this.timeout);
      }
    },

    serial(newSerial) {
      if (this.serial !== "" && this.serial !== null) {
        this.inputFilled =
          ValidationHelper.isBlank(newSerial) ||
          ValidationHelper.isValidFridgeSerialNumber(newSerial);
      } else {
        this.inputFilled = false;
      }
    },
  },

  created() {},

  computed: {
    getInputsFilled() {
      if (this.inputFilled && this.modelFridgePart && this.modelFridgeSensor) {
        return true;
      }

      return false;
    },
  },

  async mounted() {
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }

    const apiStore = useApiStore();
    const applianceControllerApi: ApplianceControllerApi =
      apiStore.getApplianceControllerApi;

    const loginStore = useLoginStore();

    const voucherCode = this.$route.query.voucherCode;

    // const res = await lastValueFrom(applianceControllerApi.getApplianceStateUsingGET({
    //   serial: "d8b25784-c16f-449a-9006-6972e8a9111b"
    // }));

    // console.log("RES: ", res);

    // if (window.localStorage.getItem("applSNDialogSeen") !== "true") {
    //   setTimeout(() => {
    //     this.dialogOpen = true;
    //   }, 1000);
    // }

    const str = this.strText.split("");
    // this.animate(str);
  },
};
</script>

<style lang="sass">
#close-btn
  .r-btn__content.row
    align-items: center
</style>
