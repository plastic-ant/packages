import { LightcastAPIs } from "../index";
import * as env from "env-var";
import * as nock from "nock";

describe("Tests", function () {
  let lightcast: LightcastAPIs;

  beforeAll(() => {
    lightcast = new LightcastAPIs("example", () => ({
      client_id: env.get("LIGHTCAST_CLIENT_ID").required().asString(),
      client_secret: env.get("LIGHTCAST_CLIENT_SECRET").required().asString(),
      grant_type: "client_credentials",
      scope: "emsi_open",
    }));
  });

  afterAll(() => {});

  afterEach(() => {
    nock.cleanAll();
  });

  it("request", async () => {
    nock("https://emsiservices.com/skills")
      .get("/status")
      .reply(200, {
        data: {
          message: "test!",
          healthy: true,
        },
      });

    await expect(lightcast.skills.status()).resolves.toMatchObject({
      result: {
        data: {
          message: "test!",
          healthy: true,
        },
      },
    });
  });
});
