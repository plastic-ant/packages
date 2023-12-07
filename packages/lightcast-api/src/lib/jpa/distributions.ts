import { RestClient } from "../rest-client";
import type { JsonObject } from "type-fest";
import urlcat from "urlcat";
import { QueryParameters } from "./common-types";

const baseUrl = "https://emsiservices.com/jpa/distributions";

export default (client: RestClient) => {
  const others = {
    /**
     *
     * @param facet
     * @param body
     * @param params
     * @returns
     *
     * @see https://docs.lightcast.dev/apis/job-postings#post-distributions-distributionfacet
     */
    byFacet: <R = unknown>(
      facet: "max_years_experience" | "min_years_experience" | "posting_duration" | "salary",
      body: JsonObject,
      params?: QueryParameters
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, facet), body, {
        queryParameters: { params },
      }),
  };

  /**
   *
   * @returns
   *
   * @see https://docs.lightcast.dev/apis/job-postings#get-distributions
   */
  const distributions = <R = unknown>() => client.get<void, R>(urlcat(baseUrl, ""));

  return { ...others, ...distributions } as typeof others & typeof distributions;
};
