import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/rankings";

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

export default (client: LightcastAPIClient) => ({
  timeseries: timeseries(client),
  distributions: (distributionFacet: string) => ({
    /**
     * Group and rank postings by {facet} with a distribution for each ranked item.
     * @param body
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-distributions-distributionfacet}
     */
    byFacet: <R = Response, B = unknown>(facet: string, body: B, params?: QueryParameters) =>
      client.post<typeof params, B, R>(
        urlcat(baseUrl, ":facet/distributions/:distributionFacet", { facet, distributionFacet }),
        body,
        {
          params,
        }
      ),
  }),

  /**
   * Get a list of current available ranking facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-rankings}
   */
  listAllFacets: <R = Response<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
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
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = Response, B = unknown>(facet: string, body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ":facet", { facet }), body, {
      params,
    }),
});
