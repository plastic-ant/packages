import { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";

const baseUrl = "https://emsiservices.com/ca-jpa/totals";

export default <R = unknown>(client: RestClient) =>
  /**
   *
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-totals}
   */
  (
    body: JsonObject,
    params?: {
      noc_version?: string;
      company_version?: string;
      area_version?: string;
    }
  ) =>
    client.post<typeof params, typeof body, R>(RestClient.makeUrl(baseUrl), body, {
      queryParameters: { params },
    });
