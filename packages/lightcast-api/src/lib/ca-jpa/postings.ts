import { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/ca-jpa/postings";

export default (client: RestClient) => ({
  /**
   *
   * @param id
   * @param params
   * @returns
   */
  byId: <R = unknown>(id: string, params?: { noc_version?: string; company_version?: string; area_version?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, ":id", { id }), {
      queryParameters: { params },
    }),

  /**
   *
   * @param resource
   * @param body
   * @param params
   * @returns
   */
  postings: <R = unknown>(
    body: JsonObject,
    params?: { noc_version?: string; company_version?: string; area_version?: string }
  ) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, {
      queryParameters: { params },
    }),
});
