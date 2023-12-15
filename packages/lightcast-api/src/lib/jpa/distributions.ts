import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { QueryParameters } from "./common-types";
import type { Response } from "../common-types";

const baseUrl = "https://emsiservices.com/jpa/distributions";

export default (client: LightcastAPIClient) => ({
  /**
   *
   * @param facet
   * @param body
   * @param params
   * @returns
   *
   * @see https://docs.lightcast.dev/apis/job-postings#post-distributions-distributionfacet
   */
  byFacet: <R = Response, B = unknown>(
    facet: string,
    body: B,
    params?: QueryParameters,
    cache?: ICacheInterface<string>
  ) => client.post<typeof params, B, R>(urlcat(baseUrl, facet), body, { cache, queryParameters: { params } }),

  /**
   * Get a list of available distribution facets.
   * @see API docs {@link https://docs.lightcast.dev/apis/job-postings#get-distributions}
   */
  listAllDimensions: <R = Response>(cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ""), { cache }),
});
