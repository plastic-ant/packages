import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace ById {
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
    namespace Extract {
        namespace Parameters {
            export type ConfidenceThreshold = number;
            export type Language = string;
        }
        export interface QueryParameters {
            language?: Parameters.Language;
            confidenceThreshold?: Parameters.ConfidenceThreshold;
        }
        export interface RequestBody {
            /**
             * Document to be used in the skills extraction process
             */
            text: string;
            /**
             * Filter out skills with a confidence value lower than this threshold
             */
            confidenceThreshold?: number;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
            export interface $400 {
            }
            export interface $404 {
            }
            export interface $413 {
            }
            export interface $415 {
            }
        }
    }
    namespace ExtractTrace {
        namespace Parameters {
            export type IncludeNormalizedText = boolean;
            export type Language = string;
        }
        export interface QueryParameters {
            language?: Parameters.Language;
            includeNormalizedText?: Parameters.IncludeNormalizedText;
        }
        export interface RequestBody {
            /**
             * Document to be used in the skills extraction process
             */
            text: string;
            /**
             * Filter out skills with a confidence value lower than this threshold
             */
            confidenceThreshold?: number;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
            export interface $400 {
            }
            export interface $404 {
            }
            export interface $413 {
            }
            export interface $415 {
            }
        }
    }
    namespace ListAll {
        namespace Parameters {
            export type Fields = string;
            export type Limit = number;
            export type Q = string;
            export type TypeIds = string;
        }
        export interface QueryParameters {
            q?: Parameters.Q;
            typeIds?: Parameters.TypeIds;
            fields?: Parameters.Fields;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
    namespace Meta {
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
    namespace Related {
        export interface RequestBody {
            ids: string[];
            limit?: number;
            fields?: string[];
            typeId?: string;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
    namespace Requested {
        namespace Parameters {
            export type Fields = string;
            export type TypeIds = string;
        }
        export interface QueryParameters {
            typeIds?: Parameters.TypeIds;
            fields?: Parameters.Fields;
        }
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
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
    namespace VersionChanges {
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
                };
            }
        }
    }
    namespace VersionMeta {
        namespace Responses {
            export interface $200 {
                data: {
                    [key: string]: any;
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
    namespace Versions$Version {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionChanges {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionExtract {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionExtractTrace {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionRelated {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionSkills {
        namespace Parameters {
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
        }
    }
    namespace Versions$VersionSkills$SkillId {
        namespace Parameters {
            export type SkillId = string;
            export type Version = string;
        }
        export interface PathParameters {
            version: Parameters.Version;
            skill_id: Parameters.SkillId;
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
  /**
   * versionMeta
   */
  'versionMeta'(
    parameters: Parameters<Paths.Versions$Version.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.VersionMeta.Responses.$200>
  /**
   * versionChanges - Get version specific changes.
   */
  'versionChanges'(
    parameters: Parameters<Paths.Versions$VersionChanges.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.VersionChanges.Responses.$200>
  /**
   * extract - Extract skills from document
   */
  'extract'(
    parameters: Parameters<Paths.Extract.QueryParameters & Paths.Versions$VersionExtract.PathParameters>,
    data?: Paths.Extract.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Extract.Responses.$200>
  /**
   * extractTrace - Extract skills with source tracing
   */
  'extractTrace'(
    parameters: Parameters<Paths.ExtractTrace.QueryParameters & Paths.Versions$VersionExtractTrace.PathParameters>,
    data?: Paths.ExtractTrace.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ExtractTrace.Responses.$200>
  /**
   * related
   */
  'related'(
    parameters: Parameters<Paths.Versions$VersionRelated.PathParameters>,
    data?: Paths.Related.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Related.Responses.$200>
  /**
   * byId -  Get a skill by ID.
   */
  'byId'(
    parameters: Parameters<Paths.Versions$VersionSkills$SkillId.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ById.Responses.$200>
  /**
   * listAll - Returns a list of all skills in {version} sorted by skill name
   */
  'listAll'(
    parameters: Parameters<Paths.ListAll.QueryParameters & Paths.Versions$VersionSkills.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.ListAll.Responses.$200>
  /**
   * requested - List requested skills
   */
  'requested'(
    parameters: Parameters<Paths.Requested.QueryParameters & Paths.Versions$VersionSkills.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Requested.Responses.$200>
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
  ['/versions/{version}']: {
    /**
     * versionMeta
     */
    'get'(
      parameters: Parameters<Paths.Versions$Version.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.VersionMeta.Responses.$200>
  }
  ['/versions/{version}/changes']: {
    /**
     * versionChanges - Get version specific changes.
     */
    'get'(
      parameters: Parameters<Paths.Versions$VersionChanges.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.VersionChanges.Responses.$200>
  }
  ['/versions/{version}/extract']: {
    /**
     * extract - Extract skills from document
     */
    'post'(
      parameters: Parameters<Paths.Extract.QueryParameters & Paths.Versions$VersionExtract.PathParameters>,
      data?: Paths.Extract.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Extract.Responses.$200>
  }
  ['/versions/{version}/extract/trace']: {
    /**
     * extractTrace - Extract skills with source tracing
     */
    'post'(
      parameters: Parameters<Paths.ExtractTrace.QueryParameters & Paths.Versions$VersionExtractTrace.PathParameters>,
      data?: Paths.ExtractTrace.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ExtractTrace.Responses.$200>
  }
  ['/versions/{version}/related']: {
    /**
     * related
     */
    'post'(
      parameters: Parameters<Paths.Versions$VersionRelated.PathParameters>,
      data?: Paths.Related.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Related.Responses.$200>
  }
  ['/versions/{version}/skills/{skill_id}']: {
    /**
     * byId -  Get a skill by ID.
     */
    'get'(
      parameters: Parameters<Paths.Versions$VersionSkills$SkillId.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ById.Responses.$200>
  }
  ['/versions/{version}/skills']: {
    /**
     * listAll - Returns a list of all skills in {version} sorted by skill name
     */
    'get'(
      parameters: Parameters<Paths.ListAll.QueryParameters & Paths.Versions$VersionSkills.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.ListAll.Responses.$200>
    /**
     * requested - List requested skills
     */
    'post'(
      parameters: Parameters<Paths.Requested.QueryParameters & Paths.Versions$VersionSkills.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Requested.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
