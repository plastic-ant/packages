import { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";

const baseUrl = "https://emsiservices.com/ca-jpa/rankings";

const timeseries = (client: RestClient) => ({
  /**
   *
   * @param resource
   * @param requestBody
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = unknown>(
    facet: string,
    body: JsonObject,
    params?: { noc_version?: string; company_version?: string; area_version?: string }
  ) => {
    client.post<typeof params, typeof body, R>(RestClient.makeUrl(baseUrl, `/${facet}/timeseries`), body, {
      queryParameters: { params },
    });
  },
});

export default (client: RestClient) => ({
  timeseries: timeseries(client),
  /**
   *
   * @param resource
   * @param requestBody
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-rankings-rankingfacet-timeseries}
   */
  byFacet: <R = unknown>(
    facet: string,
    body: JsonObject,
    params?: { noc_version?: string; company_version?: string; area_version?: string }
  ) =>
    client.post<typeof params, typeof body, R>(RestClient.makeUrl(baseUrl, `/${facet}`), body, {
      queryParameters: { params },
    }),
});
