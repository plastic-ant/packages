import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Status, Response } from "../common-types";

const baseUrl = "https://emsiservices.com/similarity";

export default (client: LightcastAPIClient) => ({
  /**
   * Get the health of the service. Be sure to check the healthy attribute of the response.
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),

  /**
   * Get service meta data, including attribution text. Caching is encouraged, but the meta data does change periodically..
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-service-meta-data}
   */
  meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   * Get available models.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/similarity#get-get-available-models}
   */
  listAllModels: <R = Response<string[]>>(params?: { tags?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, "dimensions"), { queryParameters: { params } }),

  /**
   *
   * @param dimension - The occupation dimension used for modeling Salary Boosting Skills.
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/ddn-api#dimensions}
   */
  models: (model: string) => ({
    /**
     * Get similarity mappings based on selected model and input taxonomy item.
     * @param body - { id: Occupation code of the dimension }
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/similarity#post-get-similarity-data-on-a-selected-item}
     */

    similarity: <R = Response>(body: {
      input: string | string[];
      filter?: { ids?: string[]; minScore?: number };
      limit: number;
    }) => client.post<void, typeof body, R>(urlcat(baseUrl, "models/:model", { model }), body),
  }),
});
