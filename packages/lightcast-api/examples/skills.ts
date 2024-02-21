import apis from "./api";
import { setupCache, buildMemoryStorage } from "axios-cache-interceptor";

setupCache(apis.skills, {
  storage: buildMemoryStorage(
    /* cloneData default=*/ false,
    /* cleanupInterval default=*/ false,
    /* maxEntries default=*/ false
  ),
});

(async () => {
  const versions = await apis.skills.versions();
  //const versionsCached = await apis.skills.versions();
  //const latest = versions.data.data[0];
  //const data = await apis.skills.version(latest).byId("KS1200364C9C1LK3V5Q1");
  //console.log(JSON.stringify(data, null, " "));
  const d0 = await apis.skills.versions();
  const d1 = await apis.skills.versionMeta({ version: "latest" });
  const d2 = await apis.skills.versionChanges({ version: "latest" });
  const d3 = await apis.skills.listAll({ version: "latest" });
  const d4 = await apis.skills.byId({ version: "latest", skill_id: "KS1200364C9C1LK3V5Q1" });
  const d5 = await apis.skills.related(
    { version: "latest" },
    { ids: ["KS1200364C9C1LK3V5Q1", "KS1275N74XZ574T7N47D", "KS125QD6K0QLLKCTPJQ0"] }
  );
  const d6 = await apis.skills.extract({ version: "latest", confidenceThreshold: 0.5 }, { text: "C++ and Java coder" });
  console.log("done");
})();
