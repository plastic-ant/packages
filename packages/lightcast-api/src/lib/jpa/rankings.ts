import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { ResponseType } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/rankings";

const timeseries = (client: RestClient) => ({
  /**
   * Group and rank postings by {facet} with a monthly or daily timeseries for each ranked group. Use YYYY-MM date format in the timeseries time-frame filter, timeseries.when, to get monthly summary of each ranked group, or use YYYY-MM-DD date format for daily summary.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = ResponseType>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/timeseries", { facet }), body, {
      queryParameters: { params },
    }),
});

export default (client: RestClient) => ({
  timeseries: timeseries(client),
  distributions: (distributionFacet: string) => ({
    /**
     * Group and rank postings by {facet} with a distribution for each ranked item.
     * @param body
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-distributions-distributionfacet}
     */
    byFacet: <R = ResponseType>(facet: string, body: JsonObject, params?: QueryParameters) =>
      client.post<typeof params, typeof body, R>(
        urlcat(baseUrl, ":facet/distributions/:distributionFacet", { facet, distributionFacet }),
        body,
        {
          queryParameters: { params },
        }
      ),
  }),

  /**
   * Get a list of current available ranking facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-rankings}
   */
  listAllFacets: <R = ResponseType<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byNestedFacet: <R = ResponseType>(facet: string, nestedFacet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(
      urlcat(baseUrl, ":facet/rankings/:nestedFacet", { facet, nestedFacet }),
      body,
      { queryParameters: { params } }
    ),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = ResponseType>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet", { facet }), body, {
      queryParameters: { params },
    }),
});
