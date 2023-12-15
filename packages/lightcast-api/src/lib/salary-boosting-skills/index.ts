import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Status, Response } from "../common-types";

const baseUrl = "https://emsiservices.com/salary-boosting-skills";

export default (client: LightcastAPIClient) => ({
  /**
   * Get the health of the service. Be sure to check the healthy attribute of the response.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),

  /**
   * Get service metadata, including model taxonomy and dimension information along with attribution text.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-get-service-metadata}
   */
  meta: <R = Response>(cache?: ICacheInterface<string>) => client.get<void, R>(urlcat(baseUrl, "status"), { cache }),

  /**
   * Get a list of supported dimensions.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#get-list-all-dimensions}
   */
  listAllDimensions: <R = Response<string[]>>(params?: { tags?: string }, cache?: ICacheInterface<string>) =>
    client.get<typeof params, R>(urlcat(baseUrl, "dimensions"), {
      cache,
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
    meta: <R = Response>(cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, ":dimension", { dimension }), { cache }),

    /**
     * Get a list of salary boosting skills for an occupation.
     * @param body - { id: Occupation code of the dimension }
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/salary-boosting-skills#post-get-salary-boosting-skills}
     */
    salaryBoostingSkills: <R = Response, B = { id: string }>(body: B, cache?: ICacheInterface<string>) =>
      client.post<void, B, R>(urlcat(baseUrl, ":dimension", { dimension }), body, { cache }),
  }),
});
