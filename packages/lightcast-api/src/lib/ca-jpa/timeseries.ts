import type { JsonObject } from "type-fest";
import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/ca-jpa/timeseries";

export default (client: RestClient) => ({
  /**
   *
   * @param resource
   * @param requestBody
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-timeseries}
   */
  timeseries: <R = unknown>(
    body: JsonObject,
    params?: { noc_version?: string; company_version?: string; area_version?: string }
  ) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, {
      queryParameters: { params },
    }),
});
