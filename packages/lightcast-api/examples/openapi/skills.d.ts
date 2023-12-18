import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace Meta {
        namespace Responses {
            export interface $200 {
                data: {
                    attribution: {
                        title: string;
                        body: string;
                        latestVersion: string;
                    };
                };
            }
        }
    }
    namespace Status {
        namespace Responses {
            export interface $200 {
                data: {
                    healthy: boolean;
                    message: string;
                };
            }
        }
    }
    namespace Versions {
        namespace Responses {
            export interface $200 {
                data: string[];
            }
        }
    }
}

export interface OperationMethods {
  /**
   * status - Health check endpoint
   */
  'status'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Status.Responses.$200>
  /**
   * meta - Get service metadata, including latest version, and attribution text. Caching is encouraged, but the metadata can change weekly.
   */
  'meta'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Meta.Responses.$200>
  /**
   * versions - Version latest can be used as an alias to the latest skill version. See our Skills Taxonomy Changelog for the updates in each version.
   */
  'versions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Versions.Responses.$200>
}

export interface PathsDictionary {
  ['/status']: {
    /**
     * status - Health check endpoint
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Status.Responses.$200>
  }
  ['/meta']: {
    /**
     * meta - Get service metadata, including latest version, and attribution text. Caching is encouraged, but the metadata can change weekly.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Meta.Responses.$200>
  }
  ['/versions']: {
    /**
     * versions - Version latest can be used as an alias to the latest skill version. See our Skills Taxonomy Changelog for the updates in each version.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Versions.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
