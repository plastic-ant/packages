import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Response, Status } from "../common-types";

const baseUrl = "https://emsiservices.com/skills";

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/skills}
 */
export default (client: RestClient) => ({
  baseUrl,
  /**
   * Health check endpoint
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),

  /**
   * Get service metadata, including latest version, and attribution text. Caching is encouraged, but the metadata can change weekly.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-metadata}
   */
  meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "meta")),

  /**
   * Version latest can be used as an alias to the latest skill version. See our Skills Taxonomy Changelog for the updates in each version.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-versions}
   */
  versions: () => client.get<void, Response<string[]>>(urlcat(baseUrl, "versions")),

  /**
   *
   * @param version
   * @returns
   */
  version: (version = "latest") => ({
    /**
     * Get version specific metadata including available fields, types, skill counts and removed skill counts.
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-version-metadata}
     */
    meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "versions/:version", { version })),

    /**
     * Get version specific changes.
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-version-changes}
     */
    changes: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "versions/:version/changes", { version })),

    /**
     * Returns a list of all skills in {version} sorted by skill name
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-skills}
     */
    listAll: <R = Response>(params?: { q?: string; limit?: number; typeIds?: string; fields?: string }) =>
      client.get<typeof params, R>(urlcat(baseUrl, "versions/:version/skills", { version }), {
        queryParameters: { params },
      }),

    /**
     * Returns a list of requested skills in {version}
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-list-requested-skills}
     */
    listRequested: <R = Response>(body: { ids: string[] }, params?: { typeIds?: string; fields?: string }) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, "versions/:version/skills", { version }), body, {
        queryParameters: { params },
      }),

    /**
     * Returns information about a specific skill.
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-a-skill-by-id}
     */
    byId: <R = Response>(id: string) =>
      client.get<void, R>(urlcat(baseUrl, "versions/:version/skills/:id", { id, version })),

    /**
     * Returns a list of skills that are related to the requested skills.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-find-related-skills}
     */
    findRelated: <R = Response>(body: { ids: string[]; limit?: number; typeIds?: string; fields?: string }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, "versions/:version/skills", { version }), body),

    /**
     * Returns a list of skills found in a document.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#versions-version-extract}
     */
    extract: <R = Response>(
      body: string | Buffer | { text: string; confidenceThreshold?: number },
      params?: { language?: string; confidenceThreshold?: number }
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, "versions/:version/extract", { version }), body, {
        queryParameters: { params },
      }),

    /**
     * Returns a list of skills found in a document with its trace information, including contextual classification data found in the document that resulted in a skill match, and optionally the normalized text from the document used to extract skills.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#versions-version-extract-trace}
     */
    extractTrace: <R = Response>(
      body: string | Buffer | { text: string; confidenceThreshold?: number },
      params?: { language?: string; includeNormalizedText: boolean }
    ) =>
      client.post<typeof params, typeof body, R>(
        urlcat(baseUrl, "versions/:version/extract/trace", { version }),
        body,
        { queryParameters: { params } }
      ),
  }),
});
