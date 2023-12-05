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
  private authClient = new ht.HttpClient("igr8-auth", [], { keepAlive: true, allowRetries: true, maxRetries: 16 });
  private authUrlParams: string;
  private bearerCredentialHandler = new hm.BearerCredentialHandler("invalid");
  private scope: string[];

  static makeUrl(base: string, path?: string) {
    const url = new URL(path ?? "", base);
    if (URL.canParse(url)) {
      return url.toString();
    }
    throw new Error(`Invaild url -> ${url.toString()}`);
  }

  get scopes() {
    return this.scope;
  }

  /**
   *
   * @param props
   * @param options
   */
  constructor(props: AuthKeys, options?: ifm.IRequestOptions) {
    super("igr8", undefined, [], { ...options, keepAlive: true, allowRetries: true, maxRetries: 16 });
    this.client.handlers.push(this.bearerCredentialHandler);
    this.authUrlParams = new URLSearchParams(omitBy(props, isNil)).toString();
    this.scope = props.scope.split(" ");
  }

  //protected abstract authenticated(): void;

  private async refreshToken() {
    const response = await this.authClient.post("https://auth.emsicloud.com/connect/token", this.authUrlParams, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = await response.readBody();

    if (response.message.statusCode === 200) {
      const token = JSON.parse(body) as AuthTokenResponse;
      this.bearerCredentialHandler.token = token.access_token;
      this.scope = token.scope.split(" ");
      //this.authenticated();
      return;
    }

    throw new Error(body);
  }

  /**
   *
   * @param resource
   * @param options
   * @returns
   */
  override async get<Q = unknown, R = unknown, P extends string = string>(
    resource: P,
    options?: RequestOptions<Q>
  ): Promise<rm.IRestResponse<R>> {
    return super.get<R>(resource, options as rm.IRequestOptions).catch(async (error) => {
      if (error.statusCode === 401) {
        return this.refreshToken().then(() => this.get(resource, options));
      }
      throw new Error(error);
    });
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
  ): Promise<rm.IRestResponse<R>> {
    return super.create<R>(resource, body, options as rm.IRequestOptions).catch(async (error) => {
      if (error.statusCode === 401) {
        return this.refreshToken().then(() => this.get(resource, options));
      }
      throw new Error(error);
    });
  }
}
