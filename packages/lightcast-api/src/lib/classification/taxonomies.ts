import { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";

const baseUrl = "https://classification.emsicloud.com/taxonomies";

export default (client: RestClient) => {
  const others = {
    /**
     *
     * @param facet
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy}
     */
    meta: <R = unknown>(facet: string) => client.get<void, R>(RestClient.makeUrl(baseUrl, `${facet}`)),

    /**
     *
     * @param facet
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions}
     */
    versions: <R = unknown>(facet: string) => client.get<void, R>(RestClient.makeUrl(baseUrl, `${facet}/versions`)),

    version: (version: string) => ({
      /**
       *
       * @param facet
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#taxonomies-taxonomy-versions-version}
       */
      meta: <R = unknown>(facet: string) =>
        client.get<void, R>(RestClient.makeUrl(baseUrl, `${facet}/versions/${version}`)),

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
        client.get<typeof params, R>(RestClient.makeUrl(baseUrl, `${facet}/versions/${version}/concepts`), {
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
        client.get<typeof params, R>(RestClient.makeUrl(baseUrl, `${facet}/versions/${version}/concepts/${id}`), {
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
        client.post<void, typeof body, R>(RestClient.makeUrl(baseUrl, `${facet}/versions/${version}/relations`), body),
    }),
  };

  /**
   *
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-all-taxonomies}
   */
  const baseFunction = <R = unknown>(params?: { tags?: string }) =>
    client.get<typeof params, R>(RestClient.makeUrl(baseUrl, `taxonomies`), {
      queryParameters: { params },
    });

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
