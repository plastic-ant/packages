import type { JsonObject } from "type-fest";

export type Status = { readonly data: { readonly healthy: boolean; readonly message: string } };

export type Versions = { readonly data: string[] };

export type ResponseType<D = JsonObject> = JsonObject & { data: D };
//export type ResponseArray = JsonObject & { data: NonNullable<JsonArray> };

//export interface ResponseObject extends JsonObject {
//data: JsonValue;
//}
