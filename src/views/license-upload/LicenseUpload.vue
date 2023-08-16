<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <h2>Upload Your LocalAPI License here</h2>
    <p style="font-weight: 600; margin-top: 1rem">
      Please click on the icon and select the license file or drag and drop it
      in the box below.
    </p>
    <!-- <q-uploader
      :factory="factoryFn"
      style="max-width: 300px; margin-top: 1rem"
    /> -->
    <q-file
      color="purple-12"
      @change="handleFileChange"
      v-model="file"
      label="File picker"
    >
    </q-file>

    <r-btn @click="processFile" style="margin-top: 1rem;" label="Process file" />

    <div style="margin-top: 1rem">
      <transition v-if="isError" name="q-transition--scale">
        <p style="color: #ff0000">Error: the license is invalid</p>
      </transition>
      <transition v-if="isErrorExpired" name="q-transition--scale">
        <p>
          The license is <span style="color: #ff0000">expired</span>. Please
          purchase a new license key and generate a new license
          <span
            ><r-btn label="here" color="primary" to="/first-flow/start"
          /></span>
        </p>
      </transition>
      <transition v-if="isSuccess" name="q-transition--scale">
        <p class="text-green">API Activated!</p>
      </transition>
    </div>
  </div>
</template>

<script>
import { useRockhopper } from "@ldc_ulm/rockhopper";
import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

import {
  retrieveKeyFromStorage,
  readEncryptedFileAndDecrypt,
} from "@/composables/use-encryption-signing";

export default {
  name: "LicenseUpload",
  data() {
    return {
      license: {},
      file: null,
      isErrorExpired: false,
      isError: false,
      isSuccess: false,
    };
  },

  mounted() {
    const $r = useRockhopper();

    $r.iconSet.uploader["upload"] = "lh:upload";
    $r.iconSet.uploader["add"] = "lh:plus";
  },

  computed: {},

  methods: {
    handleFileChange(files) {
      this.file = files[0];
    },

    processFile() {
      if (this.file) {
        // File processing logic
        try {
          retrieveKeyFromStorage().then((key) => {
            readEncryptedFileAndDecrypt(this.file, key).then((res) => {
              this.license = res;
              this.isSuccess = true;
            });
          });
        } catch (e) {
          this.isError = true;
        }
      } else {
        this.isError = true;
      }
    },

    factoryFn(files) {
      console.log("FILES ", files);

      setTimeout(() => {
        this.isErrorExpired = true;
        console.log("Upload", this.isError);
      }, 2000);
    },
  },
};
</script>

<style></style>
