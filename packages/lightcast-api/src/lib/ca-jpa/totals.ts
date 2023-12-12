import type { JsonObject } from "type-fest";
import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/ca-jpa/totals";

export default (client: LightcastAPIClient) =>
  /**
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-totals}
   */
  <R = Response>(body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, {
      queryParameters: { params },
    });
