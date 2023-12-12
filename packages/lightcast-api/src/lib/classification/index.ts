import { LightcastAPIClient } from "../..";
import mappings from "./mappings";
import taxonomies from "./taxonomies";
import classifications from "./classifications";
import urlcat from "urlcat";
import type { Status, Response } from "../common-types";

const baseUrl = "https://classification.emsicloud.com";

export default (client: LightcastAPIClient) => ({
  /**
   *
   * @returns
   * @See API docs {@link https://docs.lightcast.dev/apis/skills#get-get-service-status}
   */
  status: () => client.get<void, Response<Status>>(urlcat(baseUrl, "status")),
  taxonomies: taxonomies(client),
  mappings: mappings(client),
  classifications: classifications(client),
});

/*export class ClassificationAPI {
  readonly taxonomies: Taxonomies;
  readonly mappings: Mappings;
  readonly classifications: Classifications;

  constructor(private client: RestClient) {
    this.taxonomies = new Taxonomies(client);
    this.mappings = new Mappings(client);
    this.classifications = new Classifications(client);
  }
}
*/
