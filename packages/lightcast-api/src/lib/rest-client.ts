import * as rm from "typed-rest-client/RestClient";
import * as hm from "typed-rest-client/Handlers";
import * as ht from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";
import { omitBy, isNil } from "lodash";

interface RequestQueryParams<Q> extends Omit<ifm.IRequestQueryParams, "params"> {
  readonly params: Q;
}

export interface RequestOptions<Q> extends Omit<rm.IRequestOptions, "queryParameters"> {
  readonly queryParameters?: RequestQueryParams<Q>;
}

interface AuthTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly scope: string;
  readonly token_type: string;
}

export interface AuthKeys {
  readonly client_id: string;
  readonly client_secret: string;
  readonly grant_type: "client_credentials";
  readonly scope: string;
}

/**
 *
 */
export class RestClient extends rm.RestClient {
  private bearerCredentialHandler = new hm.BearerCredentialHandler("");
  private expiresIn: number = 0;
  private scope: string[] = [];

  get scopes() {
    return this.scope;
  }

  /**
   *
   * @param props
   * @param options
   */
  constructor(private userAgent: string, private authKeys: () => AuthKeys, options?: ifm.IRequestOptions) {
    super(userAgent, undefined, [], { ...options, keepAlive: true, allowRetries: true, maxRetries: 16 });
    this.client.handlers.push(this.bearerCredentialHandler);
  }

  private async refreshToken() {
    const now = Date.now();
    if (now >= this.expiresIn) {
      const auth = this.authKeys();
      const params = new URLSearchParams(omitBy(auth, isNil)).toString();

      const response = await new ht.HttpClient(`${this.userAgent}-auth`).post(
        "https://auth.emsicloud.com/connect/token",
        params,
        { "Content-Type": "application/x-www-form-urlencoded" }
      );

      const body = await response.readBody();
      const { expires_in, access_token, scope } = JSON.parse(body) as AuthTokenResponse;
      this.expiresIn = now + expires_in * 1000;
      this.bearerCredentialHandler.token = access_token;
      this.scope = scope.split(" ");
    }
  }

  /**
   *
   * @param resource
   * @param options
   * @returns
   */
  override async get<Q = unknown, R = unknown, P extends string = string>(resource: P, options?: RequestOptions<Q>) {
    return this.refreshToken().then(() => super.get<R>(resource, options as rm.IRequestOptions));
  }

  /**
   *
   * @param resource
   * @param body
   * @param options
   * @returns
   */
  async post<Q = unknown, B = unknown, R = unknown, P extends string = string>(
    resource: P,
    body: B,
    options?: RequestOptions<Q>
  ) {
    return this.refreshToken().then(() => super.create<R>(resource, body, options as rm.IRequestOptions));
  }
}
