// import { JsonObject } from "type-fest";
// import { LightcastAPIs } from "../src/index";
// import * as env from "env-var";

// const lightcast = new LightcastAPIs("example", () => ({
//   client_id: env.get("LIGHTCAST_CLIENT_ID").required().asString(),
//   client_secret: env.get("LIGHTCAST_CLIENT_SECRET").required().asString(),
//   grant_type: "client_credentials",
//   scope: "emsi_open",
// }));

// (async () => {
//   const status = await lightcast.skills.status();
//   if (status.result?.data.healthy) {
//     const versions = await lightcast.skills.versions();
//     if (versions.result) {
//       const latest = versions.result.data[0];
//       const data = await lightcast.skills.version(latest).byId<JsonObject>("KS1200364C9C1LK3V5Q1");
//       console.log(JSON.stringify(data, null, " "));
//     }
//   }
// })();
