import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://classification.emsicloud.com/mappings";

export default (client: RestClient) => {
  const others = {
    /**
     *
     * @param mappingName
     * @param body
     * @returns
     * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-map-concepts}
     */
    concepts: <R = unknown>(mappingName: string, body: { ids: string[] }) =>
      client.post<void, typeof body, R>(urlcat(baseUrl, mappingName), body),
  };

  /**
   *
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-mappings}
   */
  const baseFunction = <R = unknown>(params?: { filter?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, ""), { queryParameters: { params } });

  return { ...others, ...baseFunction } as typeof others & typeof baseFunction;
};
