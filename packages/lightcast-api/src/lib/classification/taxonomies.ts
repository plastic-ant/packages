import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://classification.emsicloud.com/taxonomies";

export default (client: RestClient) => ({
  /**
   * A list of available taxonomies
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-all-taxonomies}
   */
  listAll: <R = unknown>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "taxonomies"), {
      queryParameters: { params },
    }),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy}
   */
  meta: <R = unknown>(facet: string) => client.get<void, R>(urlcat(baseUrl, ":facet", { facet })),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions}
   */
  versions: <R = unknown>(facet: string) => client.get<void, R>(urlcat(baseUrl, ":facet/versions", { facet })),

  version: (version: string) => ({
    /**
     *
     * @param facet
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version}
     */
    meta: <R = unknown>(facet: string) =>
      client.get<void, R>(urlcat(baseUrl, ":facet/versions/:version", { facet, version })),

    /**
     *
     * @param facet
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-concepts}
     */
    concepts: <R = unknown>(
      facet: string,
      params?: { q?: string; fields?: string; filter?: string; limit?: number; after?: number; locale?: string }
    ) =>
      client.get<typeof params, R>(urlcat(baseUrl, ":facet/versions/:version/concepts", { facet, version }), {
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
    conceptsById: <R = unknown>(
      facet: string,
      id: string,
      params?: { q?: string; fields?: string; filter?: string; limit?: number; after?: number; locale?: string }
    ) =>
      client.get<typeof params, R>(urlcat(baseUrl, ":facet/versions/:version/concepts/:id", { facet, id, version }), {
        queryParameters: { params },
      }),

    /**
     *
     * @param facet
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-relations}
     */
    relations: <R = unknown>(
      facet: string,
      body: {
        relationType: "child" | "sibling" | "any";
        ids: string[];
        filter?: JsonObject;
      }
    ) =>
      client.post<void, typeof body, R>(
        urlcat(baseUrl, ":facet/versions/:version/relations", { facet, version }),
        body
      ),
  }),
});
