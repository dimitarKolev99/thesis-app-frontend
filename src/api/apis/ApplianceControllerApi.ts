// tslint:disable
/**
 * LocalAPI Portal API
 * The backend service used by the localAPI Portal UI
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable } from 'rxjs';
import { BaseAPI, throwIfRequired, encodeURI } from '../runtime';
import { Response } from '../models';

export interface GetApplianceStateUsingGETRequest {
  serial: string;
}

/**
 * no description
 */
export class ApplianceControllerApi extends BaseAPI {
  /**
   * getApplianceState
   */
  getApplianceStateUsingGET = (requestParameters: GetApplianceStateUsingGETRequest): Observable<Response> => {
    throwIfRequired(requestParameters, 'serial', 'getApplianceStateUsingGET');

    return this.request<Response>({
      path: '/appliance/{serial}'.replace('{serial}', encodeURI(requestParameters.serial)),
      method: 'GET'
    });
  };
}
