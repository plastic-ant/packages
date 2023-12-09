import * as rm from "typed-rest-client/RestClient";
import * as hm from "typed-rest-client/Handlers";
import * as ht from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";
import type { Response } from "./common-types";

interface RequestQueryParams<Q> extends Omit<ifm.IRequestQueryParams, "params"> {
  readonly params: Q;
}

export interface RequestOptions<Q> extends Omit<rm.IRequestOptions, "queryParameters"> {
  readonly queryParameters?: RequestQueryParams<Q>;
}

/**
 * Client access values or token string
 */
export type CredentialsFunction = () => Promise<
  | {
      readonly client_id: string;
      readonly client_secret: string;
      readonly grant_type: "client_credentials";
      readonly scope: string;
    }
  | string
>;

export class RestClient extends rm.RestClient {
  private bearerCredentialHandler = new hm.BearerCredentialHandler("");
  private expiresIn: number = 0;

  /**
   *
   * @param userAgent
   * @param authKeys - Function to fetch lightcast access keys
   * @param options
   */
  constructor(
    userAgent: string,
    private creds: CredentialsFunction,
    options: ifm.IRequestOptions = { keepAlive: true, allowRetries: true, maxRetries: 16 }
  ) {
    super(userAgent, undefined, [], options);
    this.client.handlers.push(this.bearerCredentialHandler);
  }

  private async refreshToken() {
    const value = await this.creds();
    if (typeof value === "string") {
      this.bearerCredentialHandler.token = value;
    } else {
      if (Date.now() >= this.expiresIn) {
        const params = new URLSearchParams(value).toString();

        const response = await new ht.HttpClient(null).post("https://auth.emsicloud.com/connect/token", params, {
          "Content-Type": "application/x-www-form-urlencoded",
        });

        const body = await response.readBody();
        const { expires_in, access_token } = JSON.parse(body);
        this.expiresIn = Date.now() + expires_in * 1000;
        this.bearerCredentialHandler.token = access_token;
      }
    }
  }

  /**
   *
   * @param resource
   * @param options
   * @returns
   */
  override get = <Q = unknown, R = Response>(resource: string, options?: RequestOptions<Q>) =>
    this.refreshToken().then(() => super.get<R>(resource, options as rm.IRequestOptions));

  /**
   *
   * @param resource
   * @param body
   * @param options
   * @returns
   */
  post = <Q = unknown, B = unknown, R = Response>(resource: string, body: B, options?: RequestOptions<Q>) =>
    this.refreshToken().then(() => super.create<R>(resource, body, options as rm.IRequestOptions));
}
