import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/timeseries";

export default (client: LightcastAPIClient) =>
  /**
   *
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-timeseries}
   */
  <R = Response, B = unknown>(body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ""), body, { params });
