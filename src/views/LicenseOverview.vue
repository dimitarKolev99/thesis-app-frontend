<template>
  <div class="about">
    <h2 style="margin-bottom: 1rem">Licenses Overview</h2>
    <div v-if="showPassCodeInput">
      <span>You need to get a pass code in order to access the overview </span>
      <r-input v-model="passCodeInp" label="Your passcode" />
      <r-btn style="margin-right: 1rem" @click="verifyPasscode" label="Verify Passcode" color="primary" />
      <r-btn @click="routeToNextStep" label="Get your passcode" /> 
    </div>

    <div v-if="passCodeIsCorrect">
      <p style="font-weight: 400; font-size: 1rem; line-height: 1.5">
        Here you can manage your licensed appliances.
      </p>
      <p style="font-weight: 400; font-size: 1rem; line-height: 1.5">
        The table below will show the data about the license serial number, the
        voucher used for it, the time of the license creation and the expiry
        date of the license.
      </p>

      <div v-if="!items">
        <div style="font-weight: 400; font-size: 1rem; line-height: 1.5">
          No licensed appliances yet?
        </div>
        <div class="textlink">
          <a class="cursor-pointer" @click="navigateToVoucher"
            ><span>Click here to get a license</span></a
          >
        </div>
      </div>

      <div v-if="items">
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
              <r-td class="row flex-center">
                <r-btn
                  flat
                  color="primary"
                  icon="lh:download"
                  style="margin-right: 10px"
                />
                <!-- <r-btn flat color="primary" icon="lh:edit" /> -->
              </r-td>
              <r-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </r-td>
            </r-tr>
          </template>
        </r-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

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
  name: "LicenseOverview",
  props: {
    pairs: Array,
  },

  data() {
    return {
      showPassCodeInput: true,
      passCodeInp: null,
      passCode: null,
      passCodeIsCorrect: false,
      prefix: "",

      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 3,
      },
      headers: headers,
      items: JSON.parse(window.localStorage.getItem("pairs")),
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
    routeToNextStep() {
      if (this.prefix === "/first-flow") {
        console.log("In first flow");
        this.$router.push(this.prefix + "/email");
      } else {
        console.log("In second flow");

        this.$emit("scrollToElement", "inputElement");
      }
    },


    verifyPasscode() {
      if (
        JSON.parse(window.localStorage.getItem("passcode")) === this.passCodeInp
      ) {
        this.showPassCodeInput = false;
        this.passCodeIsCorrect = true;
      } else {
        this.passCodeIsCorrect = false;
      }
    },

    download() {
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

    navigateToVoucher() {
      this.$router.push(this.prefix + "/voucher");
    },

    closeDialog() {
      this.show = false;
      this.firstTimeVisit = false;
      window.localStorage.setItem("termsAccepted", "true");
    },
  },
  watch: {
    items(newItems, oldItems) {
      console.log("Local storage changed:", newItems);
    },

    pairs(newPairs) {
      this.items = newPairs;
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
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }

    if (JSON.parse(window.localStorage.getItem("passcode"))) {
      this.passCode = JSON.parse(window.localStorage.getItem("passcode"));
    }

    if (this.passCode) {
    }

    const applianceSerialStore = useApplianceVoucherStore();

    this.items = applianceSerialStore.getPairs;

    console.log("ITEMS: ", this.items);

    if (applianceSerialStore.getPairs.length === 0) {
      this.items = JSON.parse(window.localStorage.getItem("pairs"));
    }

    setTimeout(() => {
      this.flag = true;
    }, 1000);
  },

  computed: {
    showDialog() {
      if (window.localStorage.getItem("termsAccepted")) {
        return false;
      }

      return this.firstTimeVisit && this.show;
    },
  },
};
</script>

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
</style>

<style lang="sass">



.terms
    text-align: left

.about
    // min-height: 100vh
    flex-direction: column
    display: flex
    align-items: center
    justify-content: center
    text-align: left
</style>
