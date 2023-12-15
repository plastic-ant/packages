import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/postings";

export default (client: LightcastAPIClient) => ({
  /**
   * Get a single posting by its id.
   * @param id
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-postings-postingid}
   */
  byId: <R = Response>(id: string, params?: QueryParameters) =>
    client.get<typeof params, R>(urlcat(baseUrl, ":id", { id }), { params }),

  /**
   *
   * Get data for individual postings that match your requested filters
   * @param body
   * @param params
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#post-postings}
   */
  filtered: <R = Response, B = unknown>(body: B, params?: QueryParameters) =>
    client.post<typeof params, B, R>(urlcat(baseUrl, ""), body, { params }),
});
