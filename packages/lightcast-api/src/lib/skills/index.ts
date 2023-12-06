import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/skills";

export default (client: RestClient) => ({
  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-status}
   */
  status: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-metadata}
   */
  meta: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "meta")),

  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-versions}
   */
  versions: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "versions")),

  /**
   *
   * @param version
   * @returns
   */
  version: (version = "latest") => ({
    /**
     *
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-version-metadata}
     */
    meta: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, `versions/${version}`)),

    /**
     *
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-a-skill-by-id}
     */
    byId: <R = unknown>(id: string) => client.get<void, R>(urlcat(baseUrl, `versions/${version}/skills/${id}`)),

    /**
     *
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-list-all-skills}
     */
    listAll: <R = unknown>(params?: { q?: string; limit?: number; typeIds?: string; fields?: string }) =>
      client.get<typeof params, R>(urlcat(baseUrl, `/versions/${version}/skills`), {
        queryParameters: { params },
      }),

    /**
     *
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-list-requested-skills}
     */
    listRequested: <R = unknown>(body: { ids: string[] }, params?: { typeIds?: string; fields?: string }) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, `versions/${version}/skills`), body, {
        queryParameters: { params },
      }),

    /**
     *
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#post-find-related-skills}
     */
    findRelated: <R = unknown>(body: { ids: string[]; limit?: number; typeIds?: string; fields?: string }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, `versions/${version}/skills`), body),

    /**
     *
     * @param params
     * @param body
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/skills#versions-version-extract}
     */
    extract: <R = unknown>(
      body: string | Buffer | { text: string; confidenceThreshold?: number },
      params?: { language?: string; confidenceThreshold?: number }
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, `versions/${version}/extract`), body, {
        queryParameters: { params },
      }),
  }),
});
