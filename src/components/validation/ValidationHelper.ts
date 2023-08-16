export class ValidationHelper {
  public static FIELD_EMPTY: string = "EMPTY";
  public static TEXT_LENGTH: string = "TEXT_LENGTH";
  public static APPLIANCE_SERIAL: string = "APPLIANCE_SERIAL";

  /**
   * This is the format of Liebherr appliances serial number.
   *
   * @private
   * @static
   * @type {RegExp}
   * @memberof ValidationHelper
   */
  private static readonly REGEX_APPLIANCE_SERIAL: RegExp = new RegExp(
    "\\d{2}.\\d{3}.\\d{3}.\\d{1}$"
  );

  /**
   * Regex for the input of a voucher code for a license.
   *
   * @private
   * @static
   * @type {RegExp}
   * @memberof ValidationHelper
   */
  private static readonly REGEX_VOUCHER_CODE: RegExp = new RegExp(
    "^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$"
  );

  /**
   * Checks that the serial number of Liebherr appliance follows our naming rules.
   *
   * @static
   * @param {string} value
   * @returns {boolean}
   * @memberof ValidationHelper
   */
  public static isValidFridgeSerialNumber(value: string): boolean {
    if (!value) {
      return false;
    }

    return this.REGEX_APPLIANCE_SERIAL.test(value);
  }

  /**
   * Checks that the given code is a valid voucher code.
   *
   * @static
   * @param {string} value The value to test.
   * @returns {boolean}
   * @memberof ValidationHelper
   */
  public static isVoucherLengthValid(value: string): boolean {
    if (!value) {
      return false;
    }

    return value.length === 9;
  }

  /**
   * Checks that the given code is a valid voucher code.
   *
   * @static
   * @param {string} value The value to test.
   * @returns {boolean}
   * @memberof ValidationHelper
   */
  public static isValidVoucherCode(value: string): boolean {
    if (!value) {
      return false;
    }

    return this.REGEX_VOUCHER_CODE.test(value);
  }

  /**
   * Flag for checking the blank string.
   *
   * @static
   * @param {string} value The input text.
   * @returns {boolean}
   * @memberof ValidationHelper
   */
  static isBlank(value: string): boolean {
    if (!value) {
      return true;
    }

    return false;
  }

  /**
   * Returns appropriate error text in validation process
   *
   * @static
   * @param {string} errorType error type definition
   * @returns {*}
   * @memberof ValidationHelper
   */
  static getErrorText(errorType: string): any {
    if (errorType === this.FIELD_EMPTY) {
      return "Field cannot be empty";
    }

    if (errorType === this.TEXT_LENGTH) {
      return "Text length must be at least 30 characters";
    }

    if (errorType === this.APPLIANCE_SERIAL) {
      return "The format of the serial number must be 'xx.xxx.xxx.x' in numbers";
    }

    // Fallback
    return "Unknown error";
  }
}
