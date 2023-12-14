import { ICacheInterface } from "../src";
import apis from "./api";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 5000 });

const toCache: ICacheInterface<string> = { set: cache.set, get: cache.get, has: cache.has, del: cache.del };

(async () => {
  const versions = await apis.skills.versions(toCache);

  if (versions?.result) {
    const latest = versions.result.data[0];
    const data = await apis.skills.version(latest).byId("KS1200364C9C1LK3V5Q1");
    console.log(JSON.stringify(data, null, " "));
  }
})();
