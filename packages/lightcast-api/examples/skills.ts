import apis from "./api";
import { setupCache, buildMemoryStorage } from "axios-cache-interceptor";

setupCache(apis.client, {
  storage: buildMemoryStorage(
    /* cloneData default=*/ false,
    /* cleanupInterval default=*/ false,
    /* maxEntries default=*/ false
  ),
});

(async () => {
  const versions = await apis.skills.versions();
  const versionsCached = await apis.skills.versions();
  const latest = versions.data.data[0];
  const data = await apis.skills.version(latest).byId("KS1200364C9C1LK3V5Q1");
  console.log(JSON.stringify(data, null, " "));
})();
