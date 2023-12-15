import { ICacheInterface, LightcastAPIClient } from "../..";
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
  meta: <R = Response>(cache?: ICacheInterface<string>) => client.get<void, R>(urlcat(baseUrl, "meta"), { cache }),

  dimensions: {
    /**
     * Get a list of supported dimensions.
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#get-list-all-dimensions}
     */
    listAllFacets: <R = Response<string[]>>(cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, ""), { cache }),

    dimension: (facet: "soc" | "onet" | "lotocc" | "lotspecocc") => ({
      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/career-pathways#dimensions-dimension}
       */
      meta: <R = Response>(cache?: ICacheInterface<string>) =>
        client.get<void, R>(urlcat(baseUrl, `dimensions/:dimension`, { dimension: facet }), { cache }),

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
        body: B,
        cache?: ICacheInterface<string>
      ) =>
        client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/feederjobs`, { dimension: facet }), body, {
          cache,
        }),

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
        body: B,
        cache?: ICacheInterface<string>
      ) =>
        client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/nextstepjobs`, { dimension: facet }), body, {
          cache,
        }),

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
        body: B,
        cache?: ICacheInterface<string>
      ) =>
        client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/skillgap`, { dimension: facet }), body, {
          cache,
        }),

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
        body: B,
        cache?: ICacheInterface<string>
      ) =>
        client.post<void, B, R>(urlcat(baseUrl, `dimensions/:dimension/bulk`, { dimension: facet }), body, {
          cache,
        }),
    }),
  },
});
