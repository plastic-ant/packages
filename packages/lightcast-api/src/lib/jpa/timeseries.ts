import type { JsonObject } from "type-fest";
import { ICacheInterface, LightcastAPIClient } from "../..";
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
  <R = Response>(body: JsonObject, params?: QueryParameters, cache?: ICacheInterface<string>) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ""), body, { cache, queryParameters: { params } });
