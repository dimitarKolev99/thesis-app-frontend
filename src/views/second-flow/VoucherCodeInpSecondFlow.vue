<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    "
  >
    <div style="width: 40%">
      <h5 class="text-left">How to get a license?</h5>
      <p>
        The first step in getting a license is to verify your purchased voucher
        code. It should be of the appropriate format. The voucher code has the
        format xxxx-xxxx (e.g. ABCD-EFGH). You can get one thorough the
        <span
          ><a
            href="https://home.liebherr.com/de/deu/de/smartmonitoring-kostenlose-lizenz/smartmonitoring-kostenlose-lizenz.html"
            >Liebherr Shop</a
          ></span
        >
        if you don't have one. Once you get it, please input it in the field
        below and press the button. The code will be then verified and you will
        get feedback if the verification was successful.
      </p>

      <r-input
        label="Voucher Code"
        :rules="voucherCodeRules"
        style="display: block; width: 50%; overflow: hidden !important"
        class="voucherCodeInpID"
        mask="AAAA-AAAA"
        :error="isError"
        :message="inpMsg"
        :success="isSuccess"
        v-model="voucherCode"
      />

      <div class="container q-mt-lg">
        <transition name="q-transition--scale">
          <r-btn
            style="height: 38px"
            v-show="voucherIsValid && showBtn"
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
    <div><img width="366" src="/images.jpg" id="Img" /></div>
  </div>
</template>

<script>
import { ValidationHelper } from "@/components/validation/ValidationHelper";

export default {
  name: "VoucherCodeInpSecondFlow",
  data() {
    return {
      showBtn: false,
      showIcon: false,
      voucherCode: "",
      voucherCodeRules: [
        (v) =>
          ValidationHelper.isVoucherLengthValid(v) ||
          this.getErrorText("LENGTH"),
        (v) =>
          ValidationHelper.isValidVoucherCode(v) || this.getErrorText("FORMAT"),
      ],

      inpMsg: "",
      isError: false,
      isSuccess: false,

      voucherIsValid: false,
      showSpinner: false,
    };
  },

  mounted() {},

  methods: {
    getErrorText(errorType) {
      if (errorType === "FORMAT") {
        return "Field cannot be empty";
      }

      if (errorType === "LENGTH") {
        return "The format must be 'xxxx-xxxx'";
      }

      return "Unknown error";
    },

    btnHandler() {
      this.showBtn = false;
      this.showSpinner = false;
      this.showIcon = true;

      this.isSuccess = true;
      this.inpMsg = "Voucher code submitted!";
      // this.isError = true;
      // this.errMsg = "Voucher Code already redeemed"
      // this.isAlreadyRedeemed = true;

      window.localStorage.setItem(
        "voucherCode",
        JSON.stringify(this.voucherCode)
      );

      setTimeout(() => {
        this.showIcon = false;
        this.isSuccess = null;
        this.inpMsg = null;
      }, 2000);
    },
  },

  computed: {},

  watch: {
    voucherCode(newVoucherCode) {
      if (this.voucherCode !== "" && this.voucherCode !== null) {
        this.voucherIsValid =
          ValidationHelper.isVoucherLengthValid(newVoucherCode) &&
          ValidationHelper.isValidVoucherCode(newVoucherCode);

        if (this.voucherIsValid) {
          this.showBtn = true;
        }
      } else {
        this.voucherIsValid = false;
      }
    },
  },
};
</script>

<style></style>
