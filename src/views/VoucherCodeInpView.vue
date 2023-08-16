<template>
  <div class="about">
    <h1>Voucher Code</h1>
    <h5>
      The first step in receiving your license file is to verify your voucher
      code that you purchased. Please input it in the field.
    </h5>
    <p>
      The voucher code has the format xxxx-xxxx (e.g. ABCD-EFGH). It can be
      obtained through the Liebherr Shop.
    </p>
    <div style="margin-top: 10px">
      <img width="366" src="/images.jpg" />
      <div class="container">
        <transition v-show="flag" name="q-transition--scale">
          <r-input
            label="Voucher Code"
            :rules="voucherCodeRules"
            mask="AAAA-AAAA"
            style="overflow: hidden !important"
            :error="isError"
            :message="errMsg"
            :success="isSuccess"
            v-model="voucherCode"
          />
        </transition>
      </div>
    </div>
    <!-- <r-btn label="Help" @click="openDialog" /> -->
    <!-- <r-dialog v-model="dialogOpen">
      <r-card>
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
            <r-tab-panels
              v-model="tab"
              animated
              class="shadow-2 rounded-borders"
            >
              <r-tab-panel name="second" style="height: 545px">
                <div class="text-h6">Your voucher code</div>
                The voucher code has the format xxxx-xxxx (e.g. ABCD-EFGH)
              </r-tab-panel>
            </r-tab-panels>
          </div>
        </r-card-section>
        <r-card-actions style="margin-top: 0">
          <r-btn
            label="Close"
            id="close-btn"
            color="primary"
            @click="dialogOpen = false"
          />
        </r-card-actions>
      </r-card>
    </r-dialog> -->
    <div class="column">
      <!-- <div class="container">
        <transition v-show="flag" name="q-transition--scale">
          <r-input
            label="Voucher Code"
            :rules="getVoucherCodeRules"
            style="overflow: hidden !important"
            :error="isError"
            :message="errMsg"
            :success="isSuccess"
            v-model="voucherCode"
          />
        </transition>
      </div> -->

      <div class="container">
        <transition v-show="isAlreadyRedeemed" name="q-transition--scale">
          <p>Please insert another one</p>
        </transition>
        <transition v-show="isAlreadyRedeemed" name="q-transition--scale">
          <p>Or did you mean to check all your licensed appliances?</p>
        </transition>
        <transition v-show="isAlreadyRedeemed" name="q-transition--scale">
          <p>If so, please click here to go to the overview page</p>
        </transition>
      </div>
    </div>

    <div class="container q-mt-lg">
      <transition name="q-transition--scale">
        <r-btn
          style="height: 38px"
          v-show="voucherIsValid"
          :loading="showSpinner"
          @click="btnHandler"
          label="Continue"
        />
      </transition>

      <transition v-show="showIcon" name="q-transition--scale">
        <r-icon name="lh:checkmark" color="#00FF00" size="24px" />
      </transition>
    </div>

    <div>
      <div class="textlink" style="margin-bottom: 50px">
        <a class="cursor-pointer" @click="navigateToMultiple"
          ><span>Or do you want to license multiple devices?</span></a
        >
      </div>
      <!-- <r-text-link label="License multiple appliances" href="/multiple-appliances"></r-text-link> -->
    </div>
  </div>
</template>

<style>
.textlink a {
  color: var(--color-steel-800);
  text-decoration: none;
  text-transform: uppercase;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: var(--color-steel-800);
}

.textlink a:hover:not(.disabled) {
  color: var(--color-steel-600);
}

.textlink a:active:not(.disabled) {
  color: var(--color-steel-800);
}

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
import type { VoucherControllerApi } from "@/api/apis";
import { lastValueFrom } from "rxjs";

import { ValidationHelper } from "@/components/validation/ValidationHelper";

import { useLoginStore } from "@/stores/LoginStore";

export default {
  data() {
    return {
      prefix: "",
      voucherCodeRules: [
        (v) =>
          ValidationHelper.isVoucherLengthValid(v) ||
          this.getErrorText("LENGTH"),
        (v) =>
          ValidationHelper.isValidVoucherCode(v) || this.getErrorText("FORMAT"),
      ],
      isAlreadyRedeemed: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      tab: "second",
      dialogOpen: false,
      strText: "Please provide the appliance serial number here.",
      str: "",
      flag: true,
      timeout: null,
      serial: "",
      voucherCode: "",
      inputFilled: false,
      voucherIsValid: false,
      showBtn: true,
      showSpinner: false,
      showIcon: false,
    };
  },

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

    navigateToMultiple() {
      this.$router.push(this.prefix + "/multiple-appliances");
    },

    shiftLeft() {},

    shiftRight() {},

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
      // this.showBtn = false;
      // const apiStore = useApiStore();
      // const voucherController: VoucherControllerApi =
      //   apiStore.getVoucherControllerApi;

      // this.showSpinner = true;
      // let res;

      // try {
      //   res = await lastValueFrom(
      //     voucherController.getVoucherStateUsingGET({
      //       code: this.voucherCode,
      //     })
      //   );
      // } catch (e) {
      //   this.isError = true;
      //   this.errMsg = "Voucher Code does not exist"
      // }

      // console.log("RES: ", res);

      // if (res && res.status == "exists") {
      //   setTimeout(() => {
      //     this.showSpinner = false;

      //     if (this.isError) {
      //       this.isError = false;
      //     }

      //     this.isSuccess = true;
      //     this.errMsg = "Voucher code is correct";

      //     this.showBtn = false;
      //     this.showIcon = true;
      //     setTimeout(() => {
      //       this.$router.push("/serial");
      //     }, 500);
      //   }, 1200);
      // } else if (res && res.status == "Already Redeemed") {
      //     this.showSpinner = false;
      //     this.isError = true;
      //     this.errMsg = "Voucher Code is already Redeemed";
      //     this.isAlreadyRedeemed = true;
      // } else {
      //   this.showSpinner = false;
      //   this.isError = true;
      // }

      this.showSpinner = false;
      // this.isError = true;
      // this.errMsg = "Voucher Code already redeemed"
      // this.isAlreadyRedeemed = true;
      const voucherCode = this.voucherCode;
      this.$router.push({ path: this.prefix + "/serial", query: { voucherCode } });
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
        this.inputFilled = true;
      } else {
        this.inputFilled = false;
      }
    },

    voucherCode(newVoucherCode) {
      if (this.voucherCode !== "" && this.voucherCode !== null) {
        this.voucherIsValid =
          ValidationHelper.isVoucherLengthValid(newVoucherCode) &&
          ValidationHelper.isValidVoucherCode(newVoucherCode);
      } else {
        this.voucherIsValid = false;
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

    setTimeout(() => {
      this.dialogOpen = true;
    }, 1000);

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
