<template>
  <div class="column" style="margin-top: 10px">
    <div class="row flex-center" style="gap: 1rem">
      <r-btn
        outline
        @click="switchHelpRequest(0)"
        label="I've lost my license"
      />
      <r-btn
        outline
        @click="switchHelpRequest(1)"
        label="I've entered wrong appliance serial number(s)"
      />
      <r-btn outline @click="switchHelpRequest(2)" label="License transfer" />
      <r-btn outline @click="switchHelpRequest(3)" label="General FAQ" />
      <r-btn outline @click="switchHelpRequest(4)" label="Contact support" />
    </div>
    <div class="column flex-center" style="margin-top: 10px">
      <div style="max-width: 50%">
        <p>Welcome to the Help page</p>
        <p>You can receive help in the following topics:</p>
        <p>
          You have lost your license and need to recover it. For this, you need
          to go to the overview page.
        </p>
        <p>
          In the cases where you have entered a wrong serial number or your
          device no longer works or you need the api for a different device, you
          should make a service request. To make a service request, please
          choose the device's serial number and if your request is about
          additional information or a technical issue.
        </p>
      </div>

      <div
        class="column flex-center"
        style="gap: 1rem"
        v-if="requestNumber == 0"
      >
        <div>
          <r-input
            label="Passcode"
            :message="errMsg"
            :success="isSuccess"
            :error="isError"
            v-model="passCode"
          />
        </div>
        <div>
          <r-btn
            style="height: 38px"
            :loading="showSpinner"
            @click="btnHandler"
            label="Continue"
          />
        </div>
      </div>
      <div style="width: 30%" v-else-if="requestNumber == 1">
        <ContactSupport />
      </div>
      <div style="width: 30%" v-else-if="requestNumber == 2">
        <ContactSupport />
      </div>
      <div v-else-if="requestNumber == 3">
        <div class="column items-center">
          <div style="max-width: 50%">
            <h5>What is LocalAPI?</h5>
            <div>
              Local API is a service from Liebherr that allows you to get access
              to your appliance's data. Liebherr offers SmartModule connects
              refrigerators and freezers in a network with Liebherr
              SmartMonitoring and allows you to use its extensive digital
              monitoring and documentation functions. In addition, appliances
              can be integrated into a customer’s existing monitoring system via
              a local API. The small electronic unit with integrated LAN/WiFi is
              ready to use as soon as it is mounted on the back of the appliance
            </div>
            <h5>What is an appliance?</h5>
            <div>
              Liebherr appliances safely store highly-sensitive medicines with
              precise electronics and temperature monitoring systems for
              hospitals, laboratories and medi cal research facilities.
            </div>
            <h5>What is a serial number?</h5>
            <div>
              A serial number is a unique, individualized, and alphanumeric
              identifier assigned to a specific item or product by its
              manufacturer, organization, or governing body. This identification
              code serves as a means of distinguishing one item from others of
              the same type, allowing for easy tracking, documentation, and
              authentication. Serial numbers are commonly found on a wide range
              of items, including electronic devices, automobiles, machinery,
              appliances, currency, and various consumer products. They play a
              crucial role in supply chain management, warranty tracking,
              inventory control, product recalls, and anti-counterfeiting
              measures. Typically, a serial number consists of a combination of
              letters, numbers, and sometimes special characters. The format and
              length of the serial number can vary depending on the industry and
              the specific purpose for which it is used. Since each serial
              number is unique, it provides a reliable method for identifying
              individual items throughout their lifecycle, from production to
              disposal or ownership transfer.
            </div>
            <h5>What are parts of fridge?</h5>
            <div>
              Your fridge is devided into two parts. Part A goes from top to the
              middle of the fridge. Part B is the part from the middle to the
              bottom.
            </div>
          </div>
        </div>
      </div>
      <div style="width: 30%" v-else-if="requestNumber == 4">
        <ContactSupport />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ContactSupport from "@/components/ContactSupport.vue";

export default {
  name: "HelpView",
  components: {
    ContactSupport,
  },
  data() {
    return {
      prefix: "",
      isError: false,
      errMsg: "",
      passCode: "",
      stringSingle: "Technical Support",
      stringOptions: ["Technical Support", "Product Information", "Other"],
      showSpinner: false,
      requestNumber: 0,
    };
  },

  methods: {
    btnHandler() {
      this.showSpinner = true;

      if (
        this.passCode === JSON.parse(window.localStorage.getItem("passcode"))
      ) {
        setTimeout(() => {
          this.showSpinner = false;
          this.$router.push("/overview");
        }, 200);
      } else {
        this.showSpinner = false;
        this.isError = true;
        this.errMsg = "Wrong passcode, please try again";
      }
    },

    switchHelpRequest(requestNumber: number): void {
      this.requestNumber = requestNumber;
    },
  },
  watch: {},

  mounted() {
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }

    this.requestNumber = this.$route.query.requestNumber;
  },

  computed: {
    props() {
      return {
        [this.type]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        dark: this.dark,
        optionsDense: this.optionsDense,
        optionsDark: this.optionsDark,
        optionsCover: this.optionsCover,
        clearable: true,
      };
    },
  },
};
</script>

<style scoped lang="sass">
div.q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  flex-grow: 2

.row
  flex: none
</style>
