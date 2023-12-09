import type { JsonObject } from "type-fest";

export type Response<D = JsonObject> = JsonObject & { data: D };
export type Status = { healthy: boolean; message: string };
