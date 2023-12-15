import { ICacheInterface, LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com/classifications";

/**
 * @see API docs {@link https://docs.lightcast.dev/apis/classification#overview}
 */
export default (client: LightcastAPIClient) => ({
  /**
   * Returns a list of available classifier releases with meta data listing the supported taxonomies and outputs.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-classifier-releases}
   */
  classifierReleases: <R = Response>(cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat(baseUrl, ""), { cache }),

  release: (release: string) => ({
    /**
     * Returns a list of available classifier data source types (e.g., postings).
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release}
     */
    availableDataSourceTypes: <R = Response>(cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, release), { cache }),

    /**
     * Returns a list of available operations for the given release and source.
     * @param source
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-source}
     */
    operationsAvailableForSource: <R = Response>(source: string, cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, `:release/:source`, { release, source }), { cache }),

    /**
     * Classifies title and description to specialized occupation.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-lot-classify}
     */
    lotClassify: <R = Response, B = { title: string; limit?: number; fields?: string[]; description?: string }>(
      body: B,
      cache?: ICacheInterface<string>
    ) => client.post<void, B, R>(urlcat(baseUrl, `:release/lot/classify`, { release }), body, { cache }),

    /**
     * Performs the requested classification operation on postings related data, including company name, title, and job description. A range of classifications may be performed on the input based on the requested outputs.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-postings-classify}
     */
    postingClassify: <
      R = Response,
      B = {
        context: {
          company: string;
          title: string;
          body: string;
        };
        outputs: string[];
      }
    >(
      body: B,
      cache?: ICacheInterface<string>
    ) => client.post<void, B, R>(urlcat(baseUrl, `:release/postings/classify`, { release }), body, { cache }),

    /**
     * Get metadata for requested version of skills extractor.
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#get-extract-skills-metadata}
     */
    extractSkillsMeta: <R = Response>(cache?: ICacheInterface<string>) =>
      client.get<void, R>(urlcat(baseUrl, `:release/skills/extract`, { release }), { cache }),

    /**
     * Extract an array of Lightcast Skills from the provided text.
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-extract-skills}
     */
    extractSkills: <
      R = Response,
      B = {
        text: string;
        confidenceThreshold: number;
        trace: boolean;
        inputLocale: string;
        outputLocale: string;
      }
    >(
      body: B,
      cache?: ICacheInterface<string>
    ) => client.post<void, B, R>(urlcat(baseUrl, `:release/skills/classify`, { release }), body, { cache }),
  }),
});
