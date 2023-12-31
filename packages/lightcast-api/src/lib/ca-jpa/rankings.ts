import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/ca-jpa/rankings";

const timeseries = (client: LightcastAPIClient) => ({
  /**
   * Group and rank postings by {facet} with a monthly or daily timeseries for each ranked group. Use YYYY-MM date format in the timeseries time-frame filter, timeseries.when, to get monthly summary of each ranked group, or use YYYY-MM-DD date format for daily summary.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = Response, B = unknown>(facet: string, body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ":facet/timeseries", { facet }), body, {
      params,
    }),
});

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#rankings}
 */
export default (client: LightcastAPIClient) => ({
  /**
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-timeseries}
   */
  timeseries: timeseries(client),

  /**
   * Get a list of current available ranking facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-rankings}
   */
  listAllFacets: <R = Response<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet-rankings-nestedrankingfacet}
   */
  byNestedFacet: <R = Response, B = unknown>(facet: string, nestedFacet: string, body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ":facet/rankings/:nestedFacet", { facet, nestedFacet }), body, {
      params,
    }),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet}
   */
  byFacet: <R = Response, B = unknown>(facet: string, body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ":facet", { facet }), body, {
      params,
    }),
});
