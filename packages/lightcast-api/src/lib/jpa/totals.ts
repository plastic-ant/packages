import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { ResponseType } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/totals";

export default (client: RestClient) =>
  /**
   * Get summary metrics on all postings matching the filters.
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-totals}
   */
  <R = ResponseType>(body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, {
      queryParameters: { params },
    });
