<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    "
  >
    <div><img width="366" src="/ApplianceSN.png" /></div>
    <div style="width: 40%">
      <h5 class="text-left">Your appliance</h5>
      <p class="text-left">
        The serial number consists of 4 numbers that are separated by
        <strong>.</strong>
      </p>
      <p style="margin-bottom: 1rem" class="text-left">
        Usually it is placed in the top part of the fridge, as shown in the
        picture.
      </p>

      <!-- <r-input
        label="Serial Number"
        :rules="serialNumberRules"
        :message="inpMsg"
        :success="isSuccess"
        :error="isError"
        v-model="serial"
        
      />

      <p style="margin-bottom: 1rem; margin-top: 1rem;" class="text-left">
        Please choose which part of the fridge you need the api for from the dropdown below.
        The option "Full" stands for all parts.
      </p>

      <q-select
        v-model="modelFridgePart"
        :options="optionsFridgePart"
        label="Options for fridge parts"
      />

      <p class="text-left" style="margin-top: 1rem;">
        Please choose the sensors that you will need. 
        The option "Full" stands for both sensors.
      </p>

      <q-select
        style="margin-top: 1rem; display: block"
        v-model="modelFridgeSensor"
        :options="optionsFridgeSensor"
        label="Options for fridge sensors"
      /> -->

      <FridgePartSensorsOptions @serial="handleSerial" @modelFridgePart="handleModelFridgePart"
      @modelFridgeSensor="handleModelFridgeSensor" />

      <div class="container" style="margin-top: 1rem">
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
  </div>
</template>

<script>
import { ValidationHelper } from "@/components/validation/ValidationHelper";
import FridgePartSensorsOptions from "@/components/fridge-options/FridgePartSensorsOptions.vue";

export default {
  name: "ApplianceSnInpSecondFlow",
  components: {
    FridgePartSensorsOptions
  },
  data() {
    return {
      modelFridgePart: null,
      modelFridgeSensor: null,
      optionsFridgePart: ["Full", "Part A", "Part B"],
      optionsFridgeSensor: ["Full", "Temperature Sensor", "Door sensor"],
      showIcon: false,
      serial: "",
      showSpinner: false,

      inputFilled: false,
      showBtn: true,
      serialNumberRules: [
        (v) =>
          ValidationHelper.isBlank(v) === false ||
          ValidationHelper.getErrorText(ValidationHelper.FIELD_EMPTY),
        (v) =>
          ValidationHelper.isValidFridgeSerialNumber(v) ||
          ValidationHelper.getErrorText(ValidationHelper.APPLIANCE_SERIAL),
      ],
      isSuccess: false,
      inpMsg: "",
      isError: false,
    };
  },

  mounted() {},

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

    btnHandler() {
      if (!window.localStorage.getItem("voucherCode")) {
        this.isError = true;
        this.inpMsg = "Please input your voucher code first!";

        return;
      }

      this.isError = null;
      this.isSuccess = true;
      this.inpMsg = "Serial number is correct!";

      const currentdate = new Date();
      const datetime =
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

      const expiresAt =
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

      this.showBtn = false;
      this.showIcon = true;

      const voucherCode = JSON.parse(
        window.localStorage.getItem("voucherCode")
      );

      const pair = {
        voucherCode: voucherCode,
        serialNumber: this.serial,
        fridgePart: this.modelFridgePart,
        fridgeSensor: this.modelFridgeSensor,
        createdAt: datetime,
        expiresAt: expiresAt,
      };

      console.log("Pair ", this.pair)

      const pairs = [];

      if (voucherCode) {
        if (window.localStorage.getItem("pairs")) {
          const pairsString = window.localStorage.getItem("pairs");
          const parsed = JSON.parse(pairsString);
          parsed.push(pair);

          this.$emit("pairs", parsed);
          this.$emit("currentPair", pair);

          window.localStorage.setItem("pairs", JSON.stringify(parsed));
        } else {
          pairs.push(pair);

          this.$emit("pairs", pairs);
          this.$emit("currentPair", pair);

          window.localStorage.setItem("pairs", JSON.stringify(pairs));
        }
      }

      setTimeout(() => {
        this.showIcon = false;
        window.localStorage.removeItem("voucherCode");
      }, 2000);
    },
  },

  computed: {
    getInputsFilled() {
      if (this.inputFilled && this.modelFridgePart && this.modelFridgeSensor) {
        return true;
      }

      return false;
    },
  },

  watch: {
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
};
</script>

<style></style>
