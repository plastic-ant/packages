import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import { QueryParameters } from "./common-types";

const baseUrl = "https://emsiservices.com/jpa/postings";

export default (client: RestClient) => ({
  /**
   *
   * @param id
   * @param params
   * @returns
   */
  byId: <R = unknown>(id: string, params?: QueryParameters) =>
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
  postings: <R = unknown>(body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, {
      queryParameters: { params },
    }),
});
