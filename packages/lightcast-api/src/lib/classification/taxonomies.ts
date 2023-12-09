import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com/taxonomies";

export default (client: RestClient) => ({
  /**
   * A list of available taxonomies
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-all-taxonomies}
   */
  listAll: <R = Response>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "taxonomies"), {
      queryParameters: { params },
    }),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy}
   */
  meta: <R = Response>(facet: string) => client.get<void, R>(urlcat(baseUrl, ":facet", { facet })),

  /**
   *
   * @param facet
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions}
   */
  versions: <R = Response>(facet: string) => client.get<void, R>(urlcat(baseUrl, ":facet/versions", { facet })),

  version: (version: string) => ({
    /**
     *
     * @param facet
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version}
     */
    meta: <R = Response>(facet: string) =>
      client.get<void, R>(urlcat(baseUrl, ":facet/versions/:version", { facet, version })),

    /**
     *
     * @param facet
     * @param params
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version-concepts}
     */
    concepts: <R = Response>(
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
    conceptsById: <R = Response>(
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
    relations: <R = Response>(
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
