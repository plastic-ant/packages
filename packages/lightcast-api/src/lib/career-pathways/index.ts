import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://emsiservices.com/career-pathways";

export default (client: RestClient) => {
  return {
    /**
     *
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-status}
     */
    status: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "status")),

    /**
     *
     * @returns
     * @See API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-get-service-metadata}
     */
    meta: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "meta")),

    dimensions: {
      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-list-all-dimensions}
       */
      listAll: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, "")),

      dimension: (dimension: "soc" | "onet" | "lotocc" | "lotspecocc") => ({
        /**
         *
         * @returns
         * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension}
         */
        meta: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, `dimensions/:dimension`, { dimension })),

        /**
         *
         * @param body
         * @returns
         * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-feederjobs}
         */
        feederJobs: <R = unknown>(body: {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }) =>
          client.post<void, typeof body, R>(urlcat(baseUrl, `dimensions/:dimension/feederjobs`, { dimension }), body),

        /**
         *
         * @param body
         * @returns
         * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-nextstepjobs}
         */
        nextStepJobs: <R = unknown>(body: {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }) =>
          client.post<void, typeof body, R>(urlcat(baseUrl, `dimensions/:dimension/nextstepjobs`, { dimension }), body),

        /**
         *
         * @param body
         * @returns
         * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-skillgap}
         */
        skillGap: <R = unknown>(body: {
          sourceId: string;
          destinationId: string;
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }) => client.post<void, typeof body, R>(urlcat(baseUrl, `dimensions/:dimension/skillgap`, { dimension }), body),

        /**
         * Get feeder and next step responses for a list of occupations.
         * @param body
         * @returns
         * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension-bulk}
         */
        bulk: <R = unknown>(body: {
          id: string;
          responseIds?: string[];
          categories?: string[];
          limit?: number;
          region?: { nation: string; level?: string; id?: string };
        }) => client.post<void, typeof body, R>(urlcat(baseUrl, `dimensions/:dimension/bulk`, { dimension }), body),
      }),
    },
  };

  /**
   *
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-list-all-dimensions}
   */
  //const baseFunction = <R = unknown>() => client.get<void, R>(urlcat(baseUrl));

  //return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
