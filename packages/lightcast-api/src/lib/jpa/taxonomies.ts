import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { JsonObject } from "type-fest";

const baseUrl = "https://emsiservices.com/jpa/taxonomies";

const lookup = (client: RestClient) => ({
  /**
   * Look up taxonomy items by IDs.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-taxonomies-facet-lookup}
   */
  byFacet: <R = JsonObject>(facet: string, body: { ids: (string | number)[] }, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/lookup", { facet }), body, {
      queryParameters: { params },
    }),
});

export default (client: RestClient) => ({
  lookup: lookup(client),

  /**
   * Search taxonomies using either whole keywords (relevance search) or partial keywords (autocomplete).
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#get-taxonomies-facet}
   */
  search: <R = JsonObject>(
    facet: string,
    params?: { q?: string; autocomplete?: boolean; limit?: number } & QueryParameters
  ) => client.get<typeof params, R>(urlcat(baseUrl, facet), { queryParameters: { params } }),

  /**
   * Get a list of current available taxonomy facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-taxonomies}
   */
  facets: <R = JsonObject>() => client.get<void, R>(urlcat(baseUrl, "")),
});
