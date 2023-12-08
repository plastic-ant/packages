import { RestClient } from "../rest-client";
import totals from "./totals";
import postings from "./postings";
import rankings from "./rankings";
import timeseries from "./timeseries";
import distributions from "./distributions";
import taxonomies from "./taxonomies";
import urlcat from "urlcat";
import type { Status } from "../types";

export default (client: RestClient) => ({
  status: <R = Status>() => client.get<void, R>(urlcat("https://emsiservices.com/ca-jpa", "status")),
  meta: <R = unknown>() => client.get<void, R>(urlcat("https://emsiservices.com/ca-jpa", "meta")),
  postings: postings(client),
  rankings: rankings(client),
  taxonomies: taxonomies(client),
  totals: totals(client),
  timeseries: timeseries(client),
  distributions: distributions(client),
});
