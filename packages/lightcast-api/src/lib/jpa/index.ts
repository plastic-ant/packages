import { RestClient } from "../rest-client";
import totals from "./totals";
import postings from "./postings";
import rankings from "./rankings";
import timeseries from "./timeseries";
import distributions from "./distributions";
import taxonomies from "./taxonomies";
import urlcat from "urlcat";
import type { Response, Status } from "../common-types";

export default (client: RestClient) => ({
  status: () => client.get<void, Response<Status>>(urlcat("https://emsiservices.com/jpa", "status")),
  meta: <R = Response>() => client.get<void, R>(urlcat("https://emsiservices.com/jpa", "meta")),
  postings: postings(client),
  rankings: rankings(client),
  taxonomies: taxonomies(client),
  totals: totals(client),
  timeseries: timeseries(client),
  distributions: distributions(client),
});
