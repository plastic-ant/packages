import type { JsonObject, JsonValue } from "type-fest";
import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com/taxonomies";

export default (client: LightcastAPIClient) => ({
  /**
   * A list of available taxonomies
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-all-taxonomies}
   */
  listAll: <R = Response>(params?: { tags?: string }, cache?: ICacheInterface<string>) =>
    client.get<typeof params, R>(urlcat(baseUrl, "taxonomies"), {
      cache,
      queryParameters: { params },
    }),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy}
   */
  meta: <R = Response>(facet: string, cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ":facet", { facet }), { cache }),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions}
   */
  versions: <R = Response<string[]>>(facet: string, cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ":facet/versions", { facet }), { cache }),

  version: (version: string) => ({
    /**
     *
     * @param facet
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version}
     */
    meta: <R = Response>(facet: string, cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, ":facet/versions/:version", { facet, version }), { cache }),

    /**
     *
     * @param facet
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-concepts}
     */
    concepts: <R = Response<JsonValue[]>>(
      facet: string,
      params?: { q?: string; fields?: string; filter?: string; limit?: number; after?: number; locale?: string },
      cache?: ICacheInterface<string>
    ) =>
      client.get<typeof params, R>(urlcat(baseUrl, ":facet/versions/:version/concepts", { facet, version }), {
        cache,
        queryParameters: { params },
      }),

    /**
     *
     * @param facet
     * @param id
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-concepts-id}
     */
    conceptsById: <R = Response>(
      facet: string,
      id: string,
      params?: { q?: string; fields?: string; filter?: string; limit?: number; after?: number; locale?: string },
      cache?: ICacheInterface<string>
    ) =>
      client.get<typeof params, R>(urlcat(baseUrl, ":facet/versions/:version/concepts/:id", { facet, id, version }), {
        cache,
        queryParameters: { params },
      }),

    /**
     *
     * @param facet
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-relations}
     */
    relations: <
      R = Response,
      B = {
        relationType: "child" | "sibling" | "any";
        ids: string[];
        filter?: JsonObject;
      }
    >(
      facet: string,
      body: B,
      cache?: ICacheInterface<string>
    ) =>
      client.post<void, B, R>(urlcat(baseUrl, ":facet/versions/:version/relations", { facet, version }), body, {
        cache,
      }),
  }),
});
