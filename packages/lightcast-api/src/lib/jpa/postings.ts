import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { ResponseType } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/postings";

export default (client: RestClient) => ({
  /**
   * Get a single posting by its id.
   * @param id
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-postings-postingid}
   */
  byId: <R = ResponseType>(id: string, params?: QueryParameters) =>
    client.get<typeof params, R>(urlcat(baseUrl, ":id", { id }), { queryParameters: { params } }),

  /**
   *
   * Get data for individual postings that match your requested filters
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-postings}
   */
  filtered: <R = ResponseType>(body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, { queryParameters: { params } }),
});
