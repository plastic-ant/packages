import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/totals";

export default (client: LightcastAPIClient) =>
  /**
   * Get summary metrics on all postings matching the filters.
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-totals}
   */
  <R = Response, B = unknown>(body: B, params?: QueryParameters, cache?: ICacheInterface<string>) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ""), body, {
      cache,
      queryParameters: { params },
    });
