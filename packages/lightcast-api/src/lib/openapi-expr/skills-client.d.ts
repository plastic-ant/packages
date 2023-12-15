import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios";

declare namespace Paths {
  namespace Meta {
    namespace Get {
      namespace Responses {
        export interface $200 {}
      }
    }
  }
  namespace Status {
    namespace Get {
      namespace Responses {
        export interface $200 {}
      }
    }
  }
}

export interface OperationMethods {}

export interface PathsDictionary {
  ["/status"]: {};
  ["/meta"]: {};
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
