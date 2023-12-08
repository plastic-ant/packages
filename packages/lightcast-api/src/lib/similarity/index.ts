import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Status, ResponseType } from "../common-types";

const baseUrl = "https://emsiservices.com/similarity";

export default (client: RestClient) => ({
  /**
   * Get the health of the service. Be sure to check the healthy attribute of the response.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-service-status}
   */
  status: <R = Status>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get service meta data, including attribution text. Caching is encouraged, but the meta data does change periodically..
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-service-meta-data}
   */
  meta: <R = ResponseType>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get available models.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-available-models}
   */
  listAllModels: <R = ResponseType<string[]>>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "dimensions"), {
      queryParameters: { params },
    }),

  /**
   *
   * @param dimension - The occupation dimension used for modeling Salary Boosting Skills.
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/ddn-api#dimensions}
   */
  models: (model: string) => ({
    /**
     * Get lists of DDN skills for an occupation.
     * @param body - { id: Occupation code of the dimension }
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/ddn-api#post-get-ddn}
     */

    similarity: <R = ResponseType>(body: { id: string; region?: { nation: string; level?: string; id?: string } }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, "models/:model", { model }), body),
  }),
});
