import { RestClient } from "../rest-client";
import type { JsonObject } from "type-fest";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/ca-jpa/distributions";

export default (client: RestClient) => ({
  /**
   *
   * @param facet
   * @param body
   * @param params
   * @returns
   *
   * @see https://docs.lightcast.dev/apis/canada-job-postings#post-distributions-distributionfacet
   */
  byFacet: <R = Response>(facet: string, body: JsonObject, params?: QueryParameters) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, facet), body, { queryParameters: { params } }),

  /**
   * Get a list of available distribution facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-distributions}
   */
  listAllDimensions: <R = Response<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),
});
