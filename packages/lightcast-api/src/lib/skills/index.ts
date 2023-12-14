import { LightcastAPIClient, ICacheInterface } from "../..";
import urlcat from "urlcat";
import type { Status } from "../common-types";
import { JsonValue } from "type-fest";

const baseUrl = "https://emsiservices.com/skills";

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/skills}
 */
export default (client: LightcastAPIClient) => ({
  baseUrl,

  /**
   * Health check endpoint
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-status}
   */
  status: () => client.get<void, Status>(urlcat(baseUrl, "status")),

  /**
   * Get service metadata, including latest version, and attribution text. Caching is encouraged, but the metadata can change weekly.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-metadata}
   */
  meta: (cache?: ICacheInterface<string>) => client.get<void>(urlcat(baseUrl, "meta"), { cache }),

  /**
   * Version latest can be used as an alias to the latest skill version. See our Skills Taxonomy Changelog for the updates in each version.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-versions}
   */
  versions: (cache?: ICacheInterface<string>) =>
    client.get<void, { data: string[] }>(urlcat(baseUrl, "versions"), { cache }),

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
    meta: <R = JsonValue>(cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, "versions/:version", { version }), { cache }),

    /**
     * Get version specific changes.
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-version-changes}
     */
    changes: <R = JsonValue>() => client.get<void, R>(urlcat(baseUrl, "versions/:version/changes", { version })),

    /**
     * Returns a list of all skills in {version} sorted by skill name
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-skills}
     */
    listAll: <R = JsonValue>(
      params?: { q?: string; limit?: number; typeIds?: string; fields?: string },
      cache?: ICacheInterface<string>
    ) =>
      client.get<typeof params, R>(urlcat(baseUrl, "versions/:version/skills", { version }), {
        queryParameters: { params },
        cache,
      }),

    /**
     * Returns a list of requested skills in {version}
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-list-requested-skills}
     */
    listRequested: <R = JsonValue>(
      body: { ids: string[] },
      params?: { typeIds?: string; fields?: string },
      cache?: ICacheInterface<string>
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, "versions/:version/skills", { version }), body, {
        cache,
        queryParameters: { params },
      }),

    /**
     * Returns information about a specific skill.
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-a-skill-by-id}
     */
    byId: <R = JsonValue>(id: string, cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, "versions/:version/skills/:id", { id, version }), { cache }),

    /**
     * Returns a list of skills that are related to the requested skills.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-find-related-skills}
     */
    findRelated: <R = JsonValue>(
      body: { ids: string[]; limit?: number; typeIds?: string; fields?: string },
      cache?: ICacheInterface<string>
    ) => client.post<void, typeof body, R>(urlcat(baseUrl, "versions/:version/skills", { version }), body, { cache }),

    /**
     * Returns a list of skills found in a document.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#versions-version-extract}
     */
    extract: <R = JsonValue>(
      body: string | Buffer | { text: string; confidenceThreshold?: number },
      params?: { language?: string; confidenceThreshold?: number },
      cache?: ICacheInterface<string>
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, "versions/:version/extract", { version }), body, {
        cache,
        queryParameters: { params },
      }),

    /**
     * Returns a list of skills found in a document with its trace information, including contextual classification data found in the document that resulted in a skill match, and optionally the normalized text from the document used to extract skills.
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#versions-version-extract-trace}
     */
    extractTrace: <R = JsonValue>(
      body: string | Buffer | { text: string; confidenceThreshold?: number },
      params?: { language?: string; includeNormalizedText: boolean },
      cache?: ICacheInterface<string>
    ) =>
      client.post<typeof params, typeof body, R>(
        urlcat(baseUrl, "versions/:version/extract/trace", { version }),
        body,
        { cache, queryParameters: { params } }
      ),
  }),
});
