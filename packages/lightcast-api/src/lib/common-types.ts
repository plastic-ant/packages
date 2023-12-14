import { JsonValue } from "type-fest";

export interface Status {
  healthy: boolean;
  message: string;
}

export type Response<R = JsonValue> = {
  data: R;
};
