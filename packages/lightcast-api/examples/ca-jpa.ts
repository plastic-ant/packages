import type { JsonObject } from "type-fest";
import apis from "./api";

apis.cajpa.rankings
  .byFacet<JsonObject>("province_name", {
    filter: { when: { start: "2019-01", end: "2020-12" }, edulevels_name: ["High school or GED"] },
    rank: { by: "unique_postings", limit: 5 },
  })
  .then((response) => {
    console.log(JSON.stringify(response.result, null, " "));
  });
