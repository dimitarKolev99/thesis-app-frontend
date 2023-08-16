<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    "
  >
    <r-input
      label="Serial Number"
      :rules="serialNumberRules"
      :message="inpMsg"
      :success="isSuccess"
      :error="isError"
      mask="##.###.###.#"
      v-model="serial"
      class="full-width"
      style="display: block; margin-bottom: 1rem"
    />

    <p style="margin-bottom: 1rem;" class="text-left">
      Please choose which part of the fridge you need the api for from the
      dropdown below. The option "Full" stands for all parts. Part A stands for the first half of the fridge from top to bottom.
      Part B stands for the second part.
    </p>

    <q-select
      style="display: block"
      class="full-width"
      v-model="modelFridgePart"
      :options="optionsFridgePart"
      label="Options for fridge parts"
    />

    <p class="text-left" style="margin-top: 1rem">
      Please choose the sensors that you will need. The option "Full" stands for
      both sensors.
    </p>

    <q-select
      style="margin-top: 1rem; display: block"
      v-model="modelFridgeSensor"
      :options="optionsFridgeSensor"
      class="full-width"
      label="Options for fridge sensors"
    />
  </div>
</template>

<script>
import { ValidationHelper } from "@/components/validation/ValidationHelper";

export default {
  name: "FridgePartSensorsOptions",
  data() {
    return {
      modelFridgePart: null,
      modelFridgeSensor: null,
      optionsFridgePart: ["Full", "Part A", "Part B"],
      optionsFridgeSensor: ["Full", "Temperature Sensor", "Door sensor"],
      serial: "",

      inputFilled: false,
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

  methods: {},

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

        if (this.inputFilled) {
          this.$emit("serial", this.serial);
        }
      } else {
        this.inputFilled = false;
      }
    },

    modelFridgePart(newVal) {
      if (newVal) {
        this.$emit("modelFridgePart", newVal);
      }
    },

    modelFridgeSensor(newVal) {
      if (newVal) {
        this.$emit("modelFridgeSensor", newVal);
      }
    },
  },
};
</script>

<style></style>
