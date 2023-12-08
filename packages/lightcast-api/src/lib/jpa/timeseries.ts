import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { ResponseType } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/timeseries";

export default (client: RestClient) =>
  /**
   *
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-timeseries}
   */
  <R = ResponseType>(body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, { queryParameters: { params } });
