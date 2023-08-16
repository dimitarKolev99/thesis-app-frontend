/**
 * Simple storage for environment settings.
 *
 * File: \src\EnvironmentHandler.ts
 * Created Date: Saturday, May 9th 2020, 12:56:22
 * Author: Sascha Herrmann
 * -----
 * Last Modified: April 4th 2023, 14:31:19
 * Modified By: Boryana Kircheva (HAU-EDCP)
 * -----
 * Copyright (c) 2017-2020 Liebherr-Hausgeräte GmbH
 */

/**
 * Environment name
 *
 * @enum {number}
 */
enum EnvName {
  LOCALHOST = 'localhost',
  LOCALFORWARD = 'localforward',
  DEVELOPMENT = 'development',
  STABLE = 'stable',
  PRODUCTION = 'production'
}

export default class EnvironmentHandler {
  // The REST URL for localforward mode.
  private static readonly LOCALFORWARD_REST_URL = 'http://localhost:8081/ui';

  /**
   * This thing can only be initialized once.
   *
   * @private
   * @type {boolean}
   * @memberof EnvironmentHandler
   */
  private static initialized: boolean = false;

  /**
   * The name of the environment.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _NAME: string;
  public static get NAME(): string {
    return EnvironmentHandler._NAME;
  }

  /**
   * The base URI for the environment.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _BASE_URI: string;
  public static get BASE_URI(): string {
    return EnvironmentHandler._BASE_URI;
  }

  /**
   * The URL for the backend calls.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _REST_URL: string;
  public static get REST_URL(): string {
    return EnvironmentHandler._REST_URL;
  }

  /**
   * The LIS login server.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _AUTHORITY: string;
  public static get AUTHORITY(): string {
    return EnvironmentHandler._AUTHORITY;
  }

  /**
   * Carries the ID of the client.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _CLIENT_ID: string;
  public static get CLIENT_ID(): string {
    return EnvironmentHandler._CLIENT_ID;
  }

  /**
   * Carries the secret of the client.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _CLIENT_SECRET: string;
  public static get CLIENT_SECRET(): string {
    return EnvironmentHandler._CLIENT_SECRET;
  }

  /**
   * The URL that the LIS redirects to after a successful login.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _REDIRECT_URI: string;
  public static get REDIRECT_URI(): string {
    return EnvironmentHandler._REDIRECT_URI;
  }

  /**
   * OAuth stuff.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _RESPONSE_TYPE: string;
  public static get RESPONSE_TYPE(): string {
    return EnvironmentHandler._RESPONSE_TYPE;
  }

  /**
   * The scope controls for the client available features.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _SCOPE: string;
  public static get SCOPE(): string {
    return EnvironmentHandler._SCOPE;
  }

  /**
   * The silent redirect URI used during login (time) extensions.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _SILENT_REDIRECT_URI: string;
  public static get SILENT_REDIRECT_URI(): string {
    return EnvironmentHandler._SILENT_REDIRECT_URI;
  }

  /**
   * The base URI to the haubus<env>smartsupport blob storage.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _SUPPORT_URI: string;
  public static get SUPPORT_URI(): string {
    return EnvironmentHandler._SUPPORT_URI;
  }

  /**
   * The base readonly SAS to access the smartsupport blob storage.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  private static _SUPPORT_SAS: string;
  public static get SUPPORT_SAS(): string {
    return EnvironmentHandler._SUPPORT_SAS;
  }

  /**
   * The maintenance link that determines whether we are down for maintenance.
   *
   * @private
   * @static
   * @type {string}
   * @memberof EnvironmentHandler
   */
  public static getMaintenanceUri(): string {
    return (
      EnvironmentHandler.SUPPORT_URI +
      '/maintenance-info/maintenance.json' +
      EnvironmentHandler.SUPPORT_SAS +
      '&date=' +
      new Date().getTime().toString()
    );
  }

  /**
   *
   *
   * @static
   * @param {string} lang The language to retrieve the link for.
   * @return {*}  {string}
   * @memberof EnvironmentHandler
   */
  public static getSupportInfoUri(lang: string): string {
    return (
      EnvironmentHandler.SUPPORT_URI +
      `/support-info/${lang}.json` +
      EnvironmentHandler.SUPPORT_SAS +
      '&date=' +
      new Date().getTime().toString()
    );
  }

  /**
   * Quick start guide.
   *
   * @static
   * @return {*}  {string}
   * @memberof EnvironmentHandler
   */
  public static getQuickInstallGuideUri(): string {
    return (
      EnvironmentHandler.SUPPORT_URI +
      `/legal-info/quick_install_guide.pdf` +
      EnvironmentHandler.SUPPORT_SAS +
      '&date=' +
      new Date().getTime().toString()
    );
  }

  /**
   * Quick SmartModule start guide.
   *
   * @static
   * @return {*}  {string}
   * @memberof EnvironmentHandler
   */
  public static getQuickSmartModuleGuideUri(): string {
    return (
      EnvironmentHandler.SUPPORT_URI +
      `/legal-info/qsg_cm006_v1_2.pdf` +
      EnvironmentHandler.SUPPORT_SAS +
      '&date=' +
      new Date().getTime().toString()
    );
  }

  /**
   * Inits the environment.
   *
   * @static
   * @param {*} json The json to initialize with.
   *
   * @memberof EnvironmentHandler
   */
  public static init(json: any) {
    if (EnvironmentHandler.initialized) {
      return;
    }

    // EnvironmentHandler._NAME = this.getEnvironmentName(json.NAME, process.env.VUE_APP_ENVIRONMENT);

    // if (!EnvironmentHandler._NAME) {
    //   return;
    // }

    EnvironmentHandler._BASE_URI = json.BASE_URI;
    EnvironmentHandler._REST_URL = json.REST_URL;
    EnvironmentHandler._WS_URL = json.WS_URL;
    EnvironmentHandler._AUTHORITY = json.AUTHORITY;
    EnvironmentHandler._CLIENT_ID = json.CLIENT_ID;
    EnvironmentHandler._CLIENT_SECRET = json.CLIENT_SECRET;
    EnvironmentHandler._REDIRECT_URI = json.REDIRECT_URI;
    EnvironmentHandler._RESPONSE_TYPE = json.RESPONSE_TYPE;
    EnvironmentHandler._SCOPE = json.SCOPE;
    EnvironmentHandler._SILENT_REDIRECT_URI = json.SILENT_REDIRECT_URI;
    EnvironmentHandler._SUPPORT_URI = json.SUPPORT_URI;
    EnvironmentHandler._SUPPORT_SAS = json.SUPPORT_SAS;

    // There is no separate env file for the localforward mode, which is like localhost but just uses the
    // local server running in IntelliJ as backend:
    EnvironmentHandler._REST_URL = this.LOCALFORWARD_REST_URL;
    // if (EnvironmentHandler._NAME === EnvName.LOCALFORWARD) {
    // }

    EnvironmentHandler.initialized = true;
  }

  /**
   * Checks whether the environment config matches the local environment name.
   *
   * @private
   * @static
   * @param {string} environmentName The name of the environment read from the environment JSON.
   * @param {string} vueAppEnvironmentName The name of the environment coming from the VUE_APP setting.
   * @returns {string} The checked environment name.
   *
   * @memberof EnvironmentHandler
   */
  private static getEnvironmentName(environmentName: string, vueAppEnvironmentName: string): string {
    if (environmentName === EnvName.LOCALHOST && vueAppEnvironmentName === EnvName.LOCALFORWARD) {
      return EnvName.LOCALFORWARD;
    }

    // release, might come from stable and production
    if (
      (vueAppEnvironmentName === 'release' &&
        (environmentName === EnvName.STABLE || environmentName === EnvName.PRODUCTION)) ||
      vueAppEnvironmentName === environmentName // INT and DEV
    ) {
      return environmentName;
    }

    return undefined;
  }

  /**
   * Checks whether we're running in local environment (localhost or localforward).
   *
   * @static
   * @return {*}  {boolean} true if the environment is local.
   *
   * @memberof EnvironmentHandler
   */
  public static isLocalEnvironment(): boolean {
    return EnvironmentHandler.NAME === EnvName.LOCALFORWARD || EnvironmentHandler.NAME === EnvName.LOCALHOST;
  }

  /**
   * Checks whether we are running in development mode (either local or DEV).
   *
   * @static
   * @return {*}  {boolean} true if environment is local or DEV.
   * @memberof EnvironmentHandler
   */
  public static isDevelopmentEnvironment(): boolean {
    return EnvironmentHandler.NAME === EnvName.DEVELOPMENT || EnvironmentHandler.isLocalEnvironment();
  }

  /**
   * Checks whether we are running in Production or Stable environment
   *
   * @static
   * @return {*}  {boolean} true if environment is Production
   * @memberof EnvironmentHandler
   */
  public static isStableOrProdEnvironment(): boolean {
    return EnvironmentHandler.NAME === EnvName.STABLE || EnvironmentHandler.NAME === EnvName.PRODUCTION;
  }

  /**
   * Checks whether we are running in Stable environment
   *
   * @static
   * @return {*}  {boolean} true if environment is stable
   * @memberof EnvironmentHandler
   */
  public static isStableEnvironment(): boolean {
    return EnvironmentHandler.NAME === EnvName.STABLE;
  }

  /**
   * Checks whether we are running in Production environment
   *
   * @static
   * @return {*}  {boolean}
   * @memberof EnvironmentHandler
   */
  public static isProdEnvironment(): boolean {
    return EnvironmentHandler.NAME === EnvName.PRODUCTION;
  }
}
