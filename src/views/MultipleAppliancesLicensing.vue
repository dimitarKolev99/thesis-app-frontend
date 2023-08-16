<template>
  <div class="about">
    <h1>Voucher codes and appliance serial numbers</h1>
    <h5 class="text-center">
      Please provide the voucher codes and appliance serial numbers.
    </h5>
    <h5 class="text-center">
      Then click on the 'Add' button so that the license is generated.
    </h5>

    <div>
      <p>When the licensing is successful you will see an overview</p>
      <div class="column">
        <div class="row">
          <div class="container full-width">
            <transition v-show="flag" name="q-transition--scale">
              <r-input
                ref="voucherCodeInputRef"
                label="Voucher Code"
                class="full-width"
                :rules="voucherCodeRules"
                mask="AAAA-AAAA"
                :error="isError"
                :message="errMsg"
                :success="isSuccess"
                v-model="voucherCode"
              />
            </transition>

            <transition v-show="flag" name="q-transition--scale">
              <FridgePartSensorsOptions
                @serial="handleSerial"
                @modelFridgePart="handleModelFridgePart"
                @modelFridgeSensor="handleModelFridgeSensor"
              />
            </transition>

              <r-btn
                color="primary"
                label="Add"
                class="full-width"
                @click="btnHandler"
              />
          </div>
        </div>

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
    </div>

    <div></div>

    <div class="container" v-if="items && items.length > 0">
      <!-- <div class="row" :key="pair.voucherCode" v-for="pair in listOfPairs"> -->
      <!-- <div>{{ pair.voucherCode }}</div>
        <div>{{ pair.applSerialNumber }}</div>
        <div><r-btn icon="lh:download" color="primary" size="16px" /></div> -->

      <r-table
        header="Your licensed serial numbers"
        :items="items"
        :headers="headers"
        row-key="id"
        show-pagination
        :pagination="initialPagination"
      >
        <template v-slot:header="props">
          <r-tr :props="props">
            <r-th class="text-center">Download License File</r-th>

            <r-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </r-th>
          </r-tr>
        </template>

        <template v-slot:body="props">
          <r-tr :props="props">
            <r-td class="row items-center">
              <r-btn
                flat
                color="primary"
                icon="lh:download"
                @click="download"
                style="margin-right: 10px"
              />
            </r-td>
            <r-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </r-td>
          </r-tr>
        </template>
      </r-table>

      <div style="margin-top: 1rem;" v-if="downloadClicked">
        <p>Click on the button below to go to the upload page to finish the activation of the api.</p>
        <r-btn to="/upload-file" label="Upload File" color="primary" />
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<style>
.height80 {
  height: 500px;
  width: 50%;
}

.overflow {
  /* overflow: auto; */
  max-height: 200px;
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

import { useLoginStore } from "@/stores/LoginStore";

import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

import { useRockhopper } from "@ldc_ulm/rockhopper";

import { ValidationHelper } from "@/components/validation/ValidationHelper";

import FridgePartSensorsOptions from "@/components/fridge-options/FridgePartSensorsOptions.vue";

import {
  generateAndSaveKey,
  retrieveKeyFromStorage,
  encryptAndWriteToFile,
} from "../composables/use-encryption-signing.js";

const headers = [
  {
    name: "voucherCode",
    required: true,
    label: "Voucher Code",
    align: "center",
    field: "voucherCode",
  },
  {
    name: "serialNumber",
    align: "center",
    label: "Serial Number",
    field: "serialNumber",
  },
  {
    name: "fridgePart",
    align: "center",
    label: "Fridge Part",
    field: "fridgePart",
  },
  {
    name: "fridgeSensor",
    align: "center",
    label: "Fridge sensor",
    field: "fridgeSensor",
  },
  {
    name: "createdAt",
    align: "center",
    label: "License Created At",
    field: "createdAt",
  },
  {
    name: "expiresAt",
    align: "center",
    label: "License Valid Until",
    field: "expiresAt",
  },
];

export default {
  components: {
    FridgePartSensorsOptions,
  },
  data() {
    return {
      currentItem: {},
      pairString: "",
      pairParsed: null,
      downloadClicked: false,

      modelFridgePart: null,
      modelFridgeSensor: null,

      voucherCodeRules: [
        (v) =>
          ValidationHelper.isVoucherLengthValid(v) ||
          this.getErrorText("LENGTH"),
        (v) =>
          ValidationHelper.isValidVoucherCode(v) || this.getErrorText("FORMAT"),
      ],

      serialNumberRules: [
        (v) =>
          ValidationHelper.isBlank(v) === false ||
          ValidationHelper.getErrorText(ValidationHelper.FIELD_EMPTY),
        (v) =>
          ValidationHelper.isValidFridgeSerialNumber(v) ||
          ValidationHelper.getErrorText(ValidationHelper.APPLIANCE_SERIAL),
      ],

      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 3,
      },
      headers: headers,
      items: [],
      listOfPairs: [],
      isAlreadyRedeemed: false,
      isError: false,
      isSuccess: false,
      errMsg: "",
      tab: "second",
      dialogOpen: false,
      strText: "",
      str:
        "Please provide the voucher codes and appliance serial numbers." +
        " Then click on the 'Add' button so that the license is generated.",
      flag: true,
      timeout: null,
      serial: "",
      voucherCode: "",
      applSerialNumber: "",
      serialInputFilled: false,
      voucherInputFilled: false,
      showBtn: true,
      showSpinner: false,
      showIcon: false,
    };
  },

  methods: {
    async download() {

      console.log("SN: ", this.currentItem);

      generateAndSaveKey()
        .then(() => {
          return retrieveKeyFromStorage();
        })
        .then((key) => {
          encryptAndWriteToFile(
            this.pairString,
            key,
            this.currentItem.serialNumber
          );

          this.downloadClicked = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

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

    addLicenseToList() {
      console.log(this.voucherCode);
      console.log(this.serial);

      // this.listOfPairs.push({
      //   voucherCode: this.voucherCode,
      //   applSerialNumber: this.applSerialNumber,
      // });

      const applianceSerialStore = useApplianceVoucherStore();

      applianceSerialStore.addPair({
        voucherCode: this.voucherCode,
        serialNumber: this.serial,
      });

      this.items.push({
        voucherCode: this.voucherCode,
        serialNumber: this.serial,
      });

      this.voucherCode = "";
      this.serial = "";

      console.log(this.voucherCodeInputRef);
      const voucherCodeInp = this.$refs.voucherCodeInputRef;
      const serialNumberInp = this.$refs.serialNumberInputRef;

      voucherCodeInp.value = "";
      voucherCodeInp.blur();

      serialNumberInp.value = "";
      serialNumberInp.blur();
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

      if (!this.items) {

        this.items = [];
      }
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
        voucherCode: this.voucherCode,
        serialNumber: this.serial,
        fridgePart: this.modelFridgePart,
        fridgeSensor: this.modelFridgeSensor,
        createdAt: datetime,
        expiresAt: expiresAt,
      };

      this.items.push(pair);

      this.currentItem = pair;

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

      this.pairString = JSON.stringify(pair);

    },
  },

  watch: {
    $route(to, from) {},

    flag(newFlag, oldFlag) {
      if (newFlag === true) {
        clearTimeout(this.timeout);
      }
    },

    serial(oldSerial, newSerial) {
      if (this.serial && oldSerial.length == 12 && this.serial == "") {
        console.log("Empty");
      }

      if (this.serial !== "" && this.serial !== null) {
        // if (oldSerial.length == 12 && newSerial.length == 0)
        this.serialInputFilled =
          ValidationHelper.isBlank(newSerial) ||
          ValidationHelper.isValidFridgeSerialNumber(newSerial);
      } else {
        this.serialInputFilled = false;
      }
    },

    voucherCode(newVoucherCode) {
      if (this.voucherCode !== "" && this.voucherCode !== null) {
        this.voucherInputFilled =
          ValidationHelper.isVoucherLengthValid(newVoucherCode) &&
          ValidationHelper.isValidVoucherCode(newVoucherCode);
      } else {
        this.voucherInputFilled = false;
      }
    },
  },

  created() {},

  mounted() {
    if (this.pairString && this.pairString !== "") {
      this.pairParsed = JSON.parse(this.pairString);
    }

    const applianceSerialStore = useApplianceVoucherStore();

    this.items = applianceSerialStore.getPairs;
    
    
    if (applianceSerialStore.getPairs.length === 0) {
      console.log("ITEMS: ", this.items);
      this.items = JSON.parse(window.localStorage.getItem("pairs"));
    }

    setTimeout(() => {
      this.dialogOpen = true;
    }, 1000);
  },
};
</script>

<style lang="sass">
#close-btn
  .r-btn__content.row
    align-items: center

.container
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  gap: 1rem
</style>
