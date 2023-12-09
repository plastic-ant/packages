import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Status, Response } from "../common-types";

const baseUrl = "https://emsiservices.com/ddn";

export default (client: RestClient) => ({
  /**
   * Get the health of the service. Be sure to check the healthy attribute of the response.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/ddn-api#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),

  /**
   * Get service metadata, including model taxonomy and dimension information along with attribution text.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/ddn-api#get-get-service-metadata}
   */
  meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get a list of supported dimensions.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/ddn-api#get-list-all-dimensions}
   */
  listAllDimensions: <R = Response<string[]>>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "dimensions"), {
      queryParameters: { params },
    }),

  /**
   *
   * @param dimension - The occupation dimension used for modeling Salary Boosting Skills.
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/ddn-api#dimensions}
   */
  dimensions: (dimension: string) => ({
    /**
     * Get dimension information.
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/ddn-api#get-get-dimension-metadata}
     */
    meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "dimensions/:dimension", { dimension })),

    /**
     * Get lists of DDN skills for an occupation.
     * @param body - { id: Occupation code of the dimension }
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/ddn-api#post-get-ddn}
     */

    ddn: <R = Response>(body: { id: string; region?: { nation: string; level?: string; id?: string } }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, "dimensions/:dimension", { dimension }), body),
  }),
});
