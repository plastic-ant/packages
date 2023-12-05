import { RestClient } from "../rest-client";

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
      availableDataSourceTypes: <R = unknown>() => client.get<void, R>(RestClient.makeUrl(baseUrl, release)),

      /**
       *
       * @param release
       * @param source
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-source}
       */
      operationsAvailableForSource: <R = unknown>(source: string) =>
        client.get<void, R>(RestClient.makeUrl(baseUrl, `${release}/${source}`)),

      /**
       *
       * @param release
       * @param body
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#classifications-release-lot-classify}
       */
      lotClassify: <R = unknown>(body: { title: string; limit?: number; fields?: string[]; description?: string }) =>
        client.post<void, typeof body, R>(RestClient.makeUrl(baseUrl, `${release}/lot/classify`), body),

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
      }) => client.post<void, typeof body, R>(RestClient.makeUrl(baseUrl, `${release}/postings/classify`), body),

      /**
       *
       * @returns
       * @see API docs {@link https://docs.lightcast.dev/apis/classification#get-extract-skills-metadata}
       */
      extractSkillsMeta: <R = unknown>() =>
        client.get<void, R>(RestClient.makeUrl(baseUrl, `${release}/skills/extract`)),

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
      }) => client.post<void, typeof body, R>(RestClient.makeUrl(baseUrl, `${release}/skills/classify`), body),
    }),
  };

  /**
   *
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-classifier-releases}
   */
  const baseFunction = <R = unknown>() => client.get<void, R>(RestClient.makeUrl(baseUrl));

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
