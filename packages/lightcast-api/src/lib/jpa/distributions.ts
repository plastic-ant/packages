import { RestClient } from "../rest-client";
import type { JsonObject } from "type-fest";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";

const baseUrl = "https://emsiservices.com/jpa/distributions";

export default (client: RestClient) => ({
  /**
   *
   * @param facet
   * @param body
   * @param params
   * @returns
   *
   * @see https://docs.lightcast.dev/apis/job-postings#post-distributions-distributionfacet
   */
  byFacet: <R = JsonObject>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, facet), body, { queryParameters: { params } }),

  /**
   * Get a list of available distribution facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-distributions}
   */
  facets: <R = JsonObject>() => client.get<void, R>(urlcat(baseUrl, "")),
});
