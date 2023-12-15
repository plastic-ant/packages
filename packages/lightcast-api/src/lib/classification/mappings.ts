import { LightcastAPIClient } from "../..";
import urlcat from "urlcat";
import type { Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com/mappings";

export default (client: LightcastAPIClient) => ({
  /**
   * Mapping meta data includes information about source and destination taxonomies.
   * @param params
   * @returns
   * @set API docs {@link https://docs.lightcast.dev/apis/classification#get-list-mappings}
   */
  meta: <R = Response>(params?: { filter?: string }) => client.get<typeof params, R>(urlcat(baseUrl, ""), { params }),

  /**
   * If there is no mapping for a concept (mappings may not include all source taxonomy concepts) or if the ID doesn't exist in the source taxonomy an empty set will be returned.
   * @param name
   * @param body
   * @returns
   * @see API docs {@link https://docs.lightcast.dev/apis/classification#post-map-concepts}
   */
  concepts: <R = Response, B = { ids: string[] }>(name: string, body: B) =>
    client.post<void, B, R>(urlcat(baseUrl, name), body),
});
