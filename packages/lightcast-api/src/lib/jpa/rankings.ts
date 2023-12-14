import type { JsonObject } from "type-fest";
import { ICacheInterface, LightcastAPIClient } from "../..";
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
  byFacet: <R = Response>(facet: string, body: JsonObject, params?: QueryParameters, cache?: ICacheInterface<string>) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/timeseries", { facet }), body, {
      cache,
      queryParameters: { params },
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
    byFacet: <R = Response>(
      facet: string,
      body: JsonObject,
      params?: QueryParameters,
      cache?: ICacheInterface<string>
    ) =>
      client.post<typeof params, typeof body, R>(
        urlcat(baseUrl, ":facet/distributions/:distributionFacet", { facet, distributionFacet }),
        body,
        {
          cache,
          queryParameters: { params },
        }
      ),
  }),

  /**
   * Get a list of current available ranking facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-rankings}
   */
  listAllFacets: <R = Response<string[]>>(cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ""), { cache }),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byNestedFacet: <R = Response>(
    facet: string,
    nestedFacet: string,
    body: JsonObject,
    params?: QueryParameters,
    cache?: ICacheInterface<string>
  ) =>
    client.post<typeof params, typeof body, R>(
      urlcat(baseUrl, ":facet/rankings/:nestedFacet", { facet, nestedFacet }),
      body,
      { cache, queryParameters: { params } }
    ),

  /**
   * Group and rank postings by {facet}.
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = Response>(facet: string, body: JsonObject, params?: QueryParameters, cache?: ICacheInterface<string>) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet", { facet }), body, {
      cache,
      queryParameters: { params },
    }),
});
