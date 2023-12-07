import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/ca-jpa/taxonomies";

const lookup = (client: RestClient) => ({
  /**
   *
   * @param resource
   * @param requestBody
   * @param params
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#post-taxonomies-facet-lookup}
   */
  byFacet: <R = unknown>(
    facet: string,
    body: { ids: (string | number)[] },
    params?: { noc_version?: string; company_version?: string; area_version?: string }
  ) =>
    client.post<typeof params, typeof body, R>(urlcat(baseUrl, ":facet/lookup", { facet }), body, {
      queryParameters: { params },
    }),
});

/*
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
 
function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}*/

export default (client: RestClient) => {
  const others = {
    lookup: lookup(client),
    /**
     *
     * @param resource
     * @param requestBody
     * @param params
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-taxonomies-facet}
     */
    byFacet: <R = unknown>(
      facet: string,
      params?: {
        q?: string;
        autocomplete?: boolean;
        limit?: number;
        noc_version?: string;
        company_version?: string;
        area_version?: string;
      }
    ) => client.get<typeof params, R>(urlcat(baseUrl, facet), { queryParameters: { params } }),
  };

  /**
   * @see API docs {@link https://docs.lightcast.dev/apis/canada-job-postings#get-taxonomies}
   */
  const baseFunction = <R = unknown>() => client.get<void, R>(urlcat(baseUrl, ""));

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
