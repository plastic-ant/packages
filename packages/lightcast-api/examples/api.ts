import { LightcastAPIs } from "../src/index";
import * as env from "env-var";

export default new LightcastAPIs("example", async () => ({
  client_id: env.get("LIGHTCAST_CLIENT_ID").required().asString(),
  client_secret: env.get("LIGHTCAST_CLIENT_SECRET").required().asString(),
  scope: env.get("LIGHTCAST_CLIENT_SCOPES").required().asString(),
  grant_type: "client_credentials",
}));
