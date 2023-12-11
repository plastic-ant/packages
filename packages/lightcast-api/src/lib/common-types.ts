import type { JsonObject } from "type-fest";

export type Response<D = JsonObject> = { data: D };
export type Status = { healthy: boolean; message: string };
