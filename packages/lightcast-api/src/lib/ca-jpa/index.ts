import { ICacheInterface, LightcastAPIClient } from "../..";
import totals from "./totals";
import postings from "./postings";
import rankings from "./rankings";
import timeseries from "./timeseries";
import distributions from "./distributions";
import taxonomies from "./taxonomies";
import urlcat from "urlcat";
import type { Response, Status } from "../common-types";

export default (client: LightcastAPIClient) => ({
  status: () => client.get<void, Response<Status>>(urlcat("https://emsiservices.com/ca-jpa", "status")),
  meta: <R = Response>(cache?: ICacheInterface<string>) =>
    client.get<void, R>(urlcat("https://emsiservices.com/ca-jpa", "meta"), { cache }),
  postings: postings(client),
  rankings: rankings(client),
  taxonomies: taxonomies(client),
  totals: totals(client),
  timeseries: timeseries(client),
  distributions: distributions(client),
});
