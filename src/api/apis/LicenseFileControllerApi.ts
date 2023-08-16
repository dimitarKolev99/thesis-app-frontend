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
import { BaseAPI, HttpHeaders, throwIfRequired, encodeURI } from '../runtime';
import { LicenseFileRequest } from '../models';

export interface CreateLicenseFileUsingPOSTRequest {
  licenseFileRequest: LicenseFileRequest;
}

export interface GetFileUsingGETRequest {
  filename: string;
}

/**
 * no description
 */
export class LicenseFileControllerApi extends BaseAPI {
  /**
   * createLicenseFile
   */
  createLicenseFileUsingPOST = (requestParameters: CreateLicenseFileUsingPOSTRequest): Observable<Blob> => {
    throwIfRequired(requestParameters, 'licenseFileRequest', 'createLicenseFileUsingPOST');

    const headers: HttpHeaders = {
      'Content-Type': 'application/json'
    };

    return this.request<Blob>({
      path: '/license',
      method: 'POST',
      headers,
      body: requestParameters.licenseFileRequest,
      responseType: 'blob'
    });
  };

  /**
   * getFile
   */
  getFileUsingGET = (requestParameters: GetFileUsingGETRequest): Observable<Blob> => {
    throwIfRequired(requestParameters, 'filename', 'getFileUsingGET');

    return this.request<Blob>({
      path: '/files/{filename}'.replace('{filename}', encodeURI(requestParameters.filename)),
      method: 'GET',
      responseType: 'blob'
    });
  };
}
