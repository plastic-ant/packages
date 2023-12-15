import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/ca-jpa/taxonomies";

const lookup = (client: LightcastAPIClient) => ({
  /**
   * Look up taxonomy items by IDs.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-taxonomies-facet-lookup}
   */
  byFacet: <R = Response, B = { ids: (string | number)[] }>(facet: string, body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ":facet/lookup", { facet }), body, {
      params,
    }),
});

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#taxonomies}
 */
export default (client: LightcastAPIClient) => ({
  lookup: lookup(client),

  /**
   * Search taxonomies using either whole keywords (relevance search) or partial keywords (autocomplete).
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-taxonomies-facet}
   */
  search: <R = Response>(
    facet: string,
    params?: { q?: string; autocomplete?: boolean; limit?: number } & QueryParameters
  ) => client.get<typeof params, R>(urlcat(baseUrl, facet), { params }),

  /**
   * Get a list of current available taxonomy facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-taxonomies}
   */
  listAllFacets: <R = Response<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),
});
