import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace $Id {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
    }
    namespace ById {
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
}

export interface OperationMethods {
  /**
   * byId -  Get a single posting by its id.
   */
  'byId'(
    parameters: Parameters<Paths.$Id.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ById.Responses.$200>
}

export interface PathsDictionary {
  ['/{id}']: {
    /**
     * byId -  Get a single posting by its id.
     */
    'get'(
      parameters: Parameters<Paths.$Id.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ById.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
