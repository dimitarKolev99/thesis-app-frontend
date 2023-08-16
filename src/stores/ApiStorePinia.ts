import { defineStore } from "pinia";
import {
  ApplianceControllerApi,
  VoucherControllerApi,
  LicenseFileControllerApi,
} from "@/api";

import { Configuration, ConfigurationParameters } from '@/api/runtime';

import EnvironmentHandler from '@/EnvironmentHandler';

export const useApiStore = defineStore("apiStore", {
  getters: {
    /**
     * Getter for the ApplianceControllerApi.
     *
     * @returns {ApplianceControllerApi}
     */
    getApplianceControllerApi(): ApplianceControllerApi {

        const configuration: Configuration = this.getConfiguration;
        const api: ApplianceControllerApi = new ApplianceControllerApi(configuration);

        return api;
    },

    /**
     * Getter for the VoucherControllerApi.
     *
     * @returns {VoucherControllerApi}
    */
    getVoucherControllerApi(): VoucherControllerApi {

        const configuration: Configuration = this.getConfiguration;
        const api: VoucherControllerApi = new VoucherControllerApi(configuration);

        return api;
    },

    /**
     * Getter for the LicenseFileControllerApi.
     *
     * @returns {LicenseFileControllerApi}
    */
    getLicenseFileControllerApi(): LicenseFileControllerApi {

        const configuration: Configuration = this.getConfiguration;
        const api: LicenseFileControllerApi = new LicenseFileControllerApi(configuration);

        return api;
    },

    /**
     * Gets the authorization for the call.
     *
     * @returns {Configuration} The OAuth object with the access token coming from the loginStore.
    */
    getConfiguration(): Configuration {
        const configurationParams: ConfigurationParameters = this.getConfigurationParameters();
        const configuration: Configuration = new Configuration(configurationParams);
  
        return configuration;
    },

        /**
     * Separate getter for the configuration parameters. This allows to add or modify them.
     *
     * @returns {ConfigurationParameters}
     */
         getConfigurationParameters(): () => ConfigurationParameters {
          return (): ConfigurationParameters => {
    
            const configurationParams: ConfigurationParameters = {
              basePath: EnvironmentHandler.REST_URL,
            };

            console.log("HERE: ", configurationParams.basePath)
    
            return configurationParams;
          };
        }
  },
});
