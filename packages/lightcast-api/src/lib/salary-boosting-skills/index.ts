import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Status } from "../types";
import type { JsonObject } from "type-fest";

const baseUrl = "https://emsiservices.com/salary-boosting-skills";

export default (client: RestClient) => ({
  /**
   * Get the health of the service. Be sure to check the healthy attribute of the response.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-get-service-status}
   */
  status: <R = Status>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get service metadata, including model taxonomy and dimension information along with attribution text.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-get-service-metadata}
   */
  meta: <R = JsonObject>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get a list of supported dimensions.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-list-all-dimensions}
   */
  listAllDimensions: <R = JsonObject>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "dimensions"), {
      queryParameters: { params },
    }),

  /**
   *
   * @param dimension - The occupation dimension used for modeling Salary Boosting Skills.
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#dimensions-dimension}
   */
  dimensions: (dimension: string) => ({
    /**
     * Get dimension information.
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-get-dimension-metadata}
     */
    meta: <R = JsonObject>() => client.get<void, R>(urlcat(baseUrl, ":dimension", { dimension })),

    /**
     * Get a list of salary boosting skills for an occupation.
     * @param body - { id: Occupation code of the dimension }
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#post-get-salary-boosting-skills}
     */
    salaryBoostingSkills: <R = JsonObject>(body: { id: string }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, ":dimension", { dimension }), body),
  }),
});
