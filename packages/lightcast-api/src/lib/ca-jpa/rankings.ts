import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import { QueryParameters } from "./common-types";

const baseUrl = "https://emsiservices.com/ca-jpa/rankings";

const timeseries = (client: RestClient) => ({
  /**
   *
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = unknown>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/timeseries", { facet }), body, {
      queryParameters: { params },
    }),
});

export default (client: RestClient) => ({
  timeseries: timeseries(client),
  /**
   * Get a list of current available ranking facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-rankings}
   */
  facets: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "")),
  /**
   *
   * @param body
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = unknown>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet", { facet }), body, {
      queryParameters: { params },
    }),
});
