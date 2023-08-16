<template>
  <div class="about">
    <h1>Download Your License</h1>
    <p v-for="text in strText" :key="text">{{ text }}</p>
    <div class="container">
      <transition v-show="flag" name="q-transition--scale">
        <r-btn label="Download License" @click="download" />
      </transition>

      <div v-show="downloadClicked" style="margin-top: 10px">
        <transition name="q-transition--scale">
          <p>
            If you want to activate the api, please click on
            <span style="font-weight: 700">Upload license & activate API</span>
          </p>
        </transition>
      </div>

      <transition v-show="flag" name="q-transition--scale">
        <r-btn label="Go to overview" to="/overview" />
      </transition>

      <transition v-show="flag" name="q-transition--scale">
        <r-btn label="License more appliances" :to="prefix + '/voucher'" />
      </transition>

      <transition v-show="flag" name="q-transition--scale">
        <r-btn label="Upload license & activate API" to="/upload-file" />
      </transition>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

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
import {
  generateAndSaveKey,
  retrieveKeyFromStorage,
  encryptAndWriteToFile,
} from "../composables/use-encryption-signing.js";

import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

export default {
  props: {
    pair: Object
  },
  data() {
    return {
      downloadClicked: false,
      prefix: "",
      pairString: null,
      pairParsed: {},
      strText: [
        "Your license file is ready to be downloaded and sent to the email provided",
        "As a next step you can click on 'Upload license & activate API' and provide the file that you downloaded.",
        "You will then receive access to your appliance's local API.",
      ],
      str: "",
      flag: true,
      timeout: null,
      email: "",
      inputFilled: false,
      checked: false,
    };
  },

  methods: {
    async download() {
      generateAndSaveKey()
        .then(() => {
          return retrieveKeyFromStorage();
        })
        .then((key) => {
          encryptAndWriteToFile(
            JSON.stringify(this.pair),
            key,
            this.pair ? this.pair.serialNumber : this.pairParsed.serialNumber
          );

          this.downloadClicked = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    // readFileAsArrayBuffer(file) {
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();

    //     reader.onload = (event) => {
    //       resolve(event.target.result);
    //     };

    //     reader.onerror = (event) => {
    //       reject(event.target.error);
    //     };

    //     reader.readAsArrayBuffer(file);
    //   });
    // },

    // async handlePrivateKeyFileSelection(file, jsonString) {
    //   const privateKey = await readFileAsArrayBuffer(file);

    //   console.log("Private Key: " + privateKey);
    //   // Convert the JSON string to a Uint8Array or ArrayBuffer
    //   const encoder = new TextEncoder();
    //   const data = encoder.encode(jsonString);

    //   // Import the private key
    //   const importedPrivateKey = await crypto.subtle.importKey(
    //     "pkcs8",
    //     privateKey,
    //     { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    //     true,
    //     ["sign"]
    //   );

    //   // Sign the data using the private key
    //   const signature = await crypto.subtle.sign(
    //     { name: "RSASSA-PKCS1-v1_5" },
    //     importedPrivateKey,
    //     data
    //   );

    //   // Convert the signature to a Base64-encoded string
    //   const base64Signature = btoa(
    //     String.fromCharCode.apply(null, new Uint8Array(signature))
    //   );

    //   return base64Signature;
    // },

    showBtn() {
      const btn = document.querySelector(".r-btn");
      btn.style.visibility = "visible";
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

    pair(newVal) {
      console.log(newVal);
    }
  },

  created() {},

  computed: {
    getPair() {
      if (this.pair) {
        return this.pair;
      }

      return {};
    }
  },

  mounted() {
    
    this.pairString = this.$route.query.pairString;
    
    if (this.pairString && this.pairString !== "") {
      this.pairParsed = JSON.parse(this.pairString);
    } else {
      this.pairString = JSON.stringify(this.pair);
      this.pairParsed = this.pair;
    }

    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }
  },
};
</script>
