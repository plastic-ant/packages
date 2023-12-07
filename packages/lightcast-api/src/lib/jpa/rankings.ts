import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import { QueryParameters } from "./common-types";

const baseUrl = "https://emsiservices.com/jpa/rankings";

const timeseries = (client: RestClient) => ({
  /**
   *
   * @param resource
   * @param requestBody
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = unknown>(facet: string, body: JsonObject, params?: QueryParameters) => {
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/timeseries", { facet }), body, {
      queryParameters: { params },
    });
  },
});

export default (client: RestClient) => {
  const others = {
    timeseries: timeseries(client),
    /**
     *
     * @param resource
     * @param requestBody
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/job-postings#post-rankings-rankingfacet}
     */
    byFacet: <R = unknown>(facet: string, body: JsonObject, params?: QueryParameters) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet", { facet }), body, {
        queryParameters: { params },
      }),
  };

  /**
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-rankings}
   */
  const baseFunction = <R = unknown>() => client.get<void, R>(urlcat(baseUrl, ""));

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
