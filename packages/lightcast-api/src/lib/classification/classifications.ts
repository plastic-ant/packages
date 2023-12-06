import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://classification.emsicloud.com/classifications";

export default (client: RestClient) => {
  const others = {
    release: (release: string) => ({
      /**
       *
       * @param release
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release}
       */
      availableDataSourceTypes: <R = unknown>() => client.get<void, R>(urlcat(baseUrl, release)),

      /**
       *
       * @param release
       * @param source
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-source}
       */
      operationsAvailableForSource: <R = unknown>(source: string) =>
        client.get<void, R>(urlcat(baseUrl, `:release/:source`, { release, source })),

      /**
       *
       * @param release
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-lot-classify}
       */
      lotClassify: <R = unknown>(body: { title: string; limit?: number; fields?: string[]; description?: string }) =>
        client.post<void, typeof body, R>(urlcat(baseUrl, `:release/lot/classify`, { release }), body),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-postings-classify}
       */
      postingClassify: <R = unknown>(body: {
        context: {
          company: string;
          title: string;
          body: string;
        };
        outputs: string[];
      }) => client.post<void, typeof body, R>(urlcat(baseUrl, `:release/postings/classify`, { release }), body),

      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#get-extract-skills-metadata}
       */
      extractSkillsMeta: <R = unknown>() =>
        client.get<void, R>(urlcat(baseUrl, `:release/skills/extract`, { release })),

      /**
       *
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-extract-skills}
       */
      extractSkills: <R = unknown>(body: {
        text: string;
        confidenceThreshold: number;
        trace: boolean;
        inputLocale: string;
        outputLocale: string;
      }) => client.post<void, typeof body, R>(urlcat(baseUrl, `:release/skills/classify`, { release }), body),
    }),
  };

  /**
   *
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-classifier-releases}
   */
  const baseFunction = <R = unknown>() => client.get<void, R>(urlcat(baseUrl, ""));

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
