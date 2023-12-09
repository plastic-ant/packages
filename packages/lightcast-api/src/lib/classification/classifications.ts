import { RestClient } from "../rest-client";
import urlcat from "urlcat";
import type { Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com/classifications";

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/classification#overview}
 */
export default (client: RestClient) => ({
  /**
   * Returns a list of available classifier releases with meta data listing the supported taxonomies and outputs.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-classifier-releases}
   */
  classifierReleases: <R = Response>() => client.get<void, R>(urlcat(baseUrl, "")),

  release: (release: string) => ({
    /**
     * Returns a list of available classifier data source types (e.g., postings).
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release}
     */
    availableDataSourceTypes: <R = Response>() => client.get<void, R>(urlcat(baseUrl, release)),

    /**
     * Returns a list of available operations for the given release and source.
     * @param source
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-source}
     */
    operationsAvailableForSource: <R = Response>(source: string) =>
      client.get<void, R>(urlcat(baseUrl, `:release/:source`, { release, source })),

    /**
     * Classifies title and description to specialized occupation.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-lot-classify}
     */
    lotClassify: <R = Response>(body: { title: string; limit?: number; fields?: string[]; description?: string }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, `:release/lot/classify`, { release }), body),

    /**
     * Performs the requested classification operation on postings related data, including company name, title, and job description. A range of classifications may be performed on the input based on the requested outputs.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-postings-classify}
     */
    postingClassify: <R = Response>(body: {
      context: {
        company: string;
        title: string;
        body: string;
      };
      outputs: string[];
    }) => client.post<void, typeof body, R>(urlcat(baseUrl, `:release/postings/classify`, { release }), body),

    /**
     * Get metadata for requested version of skills extractor.
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#get-extract-skills-metadata}
     */
    extractSkillsMeta: <R = Response>() => client.get<void, R>(urlcat(baseUrl, `:release/skills/extract`, { release })),

    /**
     * Extract an array of Lightcast Skills from the provided text.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-extract-skills}
     */
    extractSkills: <R = Response>(body: {
      text: string;
      confidenceThreshold: number;
      trace: boolean;
      inputLocale: string;
      outputLocale: string;
    }) => client.post<void, typeof body, R>(urlcat(baseUrl, `:release/skills/classify`, { release }), body),
  }),
});
