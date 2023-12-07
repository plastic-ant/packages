import { RestClient } from "../rest-client";
import urlcat from "urlcat";

const baseUrl = "https://classification.emsicloud.com/mappings";

export default (client: RestClient) => ({
  /**
   * Mapping meta data includes information about source and destination taxonomies.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-mappings}
   */
  names: <R = unknown>(params?: { filter?: string }) =>
    client.get<typeof params, R>(urlcat(baseUrl, ""), { queryParameters: { params } }),

  /**
   * If there is no mapping for a concept (mappings may not include all source taxonomy concepts) or if the ID doesn't exist in the source taxonomy an empty set will be returned.
   * @param name
   * @param body
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-map-concepts}
   */
  concepts: <R = unknown>(name: string, body: { ids: string[] }) =>
    client.post<void, typeof body, R>(urlcat(baseUrl, name), body),
});
