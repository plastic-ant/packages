import { RestClient } from "../rest-client";
import { JsonObject } from "type-fest";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/ca-jpa/distributions";

export default (client: RestClient) => {
  const others = {
    /**
     *
     * @param facet
     * @param body
     * @param params
     * @returns
     *
     * @see https://docs.lightcast.dev/apis/canada-job-postings#post-distributions-distributionfacet
     */
    byFacet: <R = unknown>(
      facet: "max_years_experience" | "min_years_experience" | "posting_duration" | "salary",
      body: JsonObject,
      params?: { noc_version?: string; company_version?: string; area_version?: string }
    ) =>
      client.post<typeof params, typeof body, R>(urlcat(baseUrl, facet), body, {
        queryParameters: { params },
      }),
  };

  /**
   *
   * @returns
   *
   * @see https://docs.lightcast.dev/apis/canada-job-postings#get-distributions
   */
  const distributions = <R = unknown>() => client.get<void, R>(urlcat(baseUrl, ""));

  return { ...others, ...distributions } as typeof others & typeof distributions;
};
