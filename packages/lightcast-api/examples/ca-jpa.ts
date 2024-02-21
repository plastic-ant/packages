import apis from "./api";

(async () => {
  const t3 = await apis.cajpa.distributions.listAllDimensions();
  console.log(JSON.stringify(t3.data, null, " "));

  const t2 = await apis.cajpa.distributions.byFacet("salary", {
    filter: { when: "active" },
    distribution: {
      type: "percentile",
      options: { keys: [25, 50, 75] },
      metrics: ["unique_postings", "duplicate_postings"],
    },
  });

  console.log(JSON.stringify(t2.data, null, " "));

  const t1 = await apis.cajpa.rankings.byFacet("province_name", {
    filter: { when: { type: "active", start: "2019-01", end: "2020-12" }, edulevels_name: ["High school or GED"] },
    rank: { by: "unique_postings", limit: 5 },
  });

  console.log(JSON.stringify(t1.data.data["rankings"].buckets, null, " "));
})();
