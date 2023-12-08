import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { ResponseType, Status } from "../common-types";

const baseUrl = "https://emsiservices.com/career-pathways";

export default (client: RestClient) => ({
  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-status}
   */
  status: <R = Status>() => client.get<void, R>(urlcat(baseUrl, "status")),

  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-metadata}
   */
  meta: <R = ResponseType>() => client.get<void, R>(urlcat(baseUrl, "meta")),

  dimensions: {
    /**
     * Get a list of supported dimensions.
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-list-all-dimensions}
     */
    listAllFacets: <R = ResponseType<string[]>>() => client.get<void, R>(urlcat(baseUrl, "")),

    dimension: (facet: "soc" | "onet" | "lotocc" | "lotspecocc") => ({
      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension}
       */
      meta: <R = ResponseType>() => client.get<void, R>(urlcat(baseUrl, `dimensions/:dimension`, { dimension: facet })),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-feederjobs}
       */
      feederJobs: <R = ResponseType>(body: {
        id: string;
        responseIds?: string[];
        categories?: string[];
        limit?: number;
        region?: { nation: string; level?: string; id?: string };
      }) =>
        client.post<void, typeof body, R>(
          urlcat(baseUrl, `dimensions/:dimension/feederjobs`, { dimension: facet }),
          body
        ),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-nextstepjobs}
       */
      nextStepJobs: <R = ResponseType>(body: {
        id: string;
        responseIds?: string[];
        categories?: string[];
        limit?: number;
        region?: { nation: string; level?: string; id?: string };
      }) =>
        client.post<void, typeof body, R>(
          urlcat(baseUrl, `dimensions/:dimension/nextstepjobs`, { dimension: facet }),
          body
        ),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-skillgap}
       */
      skillGap: <R = ResponseType>(body: {
        sourceId: string;
        destinationId: string;
        limit?: number;
        region?: { nation: string; level?: string; id?: string };
      }) =>
        client.post<void, typeof body, R>(
          urlcat(baseUrl, `dimensions/:dimension/skillgap`, { dimension: facet }),
          body
        ),

      /**
       * Get feeder and next step responses for a list of occupations.
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-bulk}
       */
      bulk: <R = ResponseType>(body: {
        id: string;
        responseIds?: string[];
        categories?: string[];
        limit?: number;
        region?: { nation: string; level?: string; id?: string };
      }) =>
        client.post<void, typeof body, R>(urlcat(baseUrl, `dimensions/:dimension/bulk`, { dimension: facet }), body),
    }),
  },
});
