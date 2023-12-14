import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/taxonomies";

const lookup = (client: LightcastAPIClient) => ({
  /**
   * Look up taxonomy items by IDs.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-taxonomies-facet-lookup}
   */
  byFacet: <R = Response>(
    facet: string,
    body: { ids: (string | number)[] },
    params?: QueryParameters,
    cache?: ICacheInterface<string>
  ) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/lookup", { facet }), body, {
      cache,
      queryParameters: { params },
    }),
});

export default (client: LightcastAPIClient) => ({
  lookup: lookup(client),

  /**
   * Search taxonomies using either whole keywords (relevance search) or partial keywords (autocomplete).
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#get-taxonomies-facet}
   */
  search: <R = Response>(
    facet: string,
    params?: { q?: string; autocomplete?: boolean; limit?: number } & QueryParameters,
    cache?: ICacheInterface<string>
  ) => client.get<typeof params, R>(urlcat(baseUrl, facet), { cache, queryParameters: { params } }),

  /**
   * Get a list of current available taxonomy facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-taxonomies}
   */
  listAllFacets: <R = Response<string[]>>(cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ""), { cache }),
});
