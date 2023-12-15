import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Response, Status } from "../common-types";

const baseUrl = "https://emsiservices.com/career-pathways";

export default (client: LightcastAPIClient) => ({
  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),

  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-metadata}
   */
  meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "meta")),

  dimensions: {
    /**
     * Get a list of supported dimensions.
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-list-all-dimensions}
     */
    listAllFacets: <R = Response<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),

    dimension: (facet: "soc" | "onet" | "lotocc" | "lotspecocc") => ({
      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension}
       */
      meta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, `dimensions/:dimension`, { dimension: facet })),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-feederjobs}
       */
      feederJobs: <
        R = Response,
        B = {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }
      >(
        body: B
      ) => client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/feederjobs`, { dimension: facet }), body),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-nextstepjobs}
       */
      nextStepJobs: <
        R = Response,
        B = {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }
      >(
        body: B
      ) => client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/nextstepjobs`, { dimension: facet }), body),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-skillgap}
       */
      skillGap: <
        R = Response,
        B = {
          sourceId: string;
          destinationId: string;
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }
      >(
        body: B
      ) => client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/skillgap`, { dimension: facet }), body),

      /**
       * Get feeder and next step responses for a list of occupations.
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-bulk}
       */
      bulk: <
        R = Response,
        B = {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }
      >(
        body: B
      ) => client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/bulk`, { dimension: facet }), body),
    }),
  },
});
