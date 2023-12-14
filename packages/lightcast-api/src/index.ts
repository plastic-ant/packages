import * as rm from "typed-rest-client/RestClient";
import * as hm from "typed-rest-client/Handlers";
import * as ht from "typed-rest-client/HttpClient";
import * as ifm from "typed-rest-client/Interfaces";

import jobPostingsAPI from "./lib/jpa";
import canadaJobPostingsAPI from "./lib/ca-jpa";
import classificationAPI from "./lib/classification";
import skillsAPI from "./lib/skills";
import careerPathwaysAPI from "./lib/career-pathways";
import salaryBoostingSkillsAPI from "./lib/salary-boosting-skills";
import ddnAPI from "./lib/ddn";
import similarityAPI from "./lib/similarity";
import occupations from "./lib/utils/occupations";

import hash from "object-hash";
import { JsonValue } from "type-fest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICacheInterface<KeyType = string, ValueType = any> = {
  has: (key: KeyType) => Promise<boolean> | boolean;
  get: (key: KeyType) => Promise<rm.IRestResponse<ValueType> | undefined> | rm.IRestResponse<ValueType> | undefined;
  set: (key: KeyType, value: rm.IRestResponse<ValueType>) => Promise<unknown> | unknown;
  del: (key: KeyType) => unknown;
};

interface RequestQueryParams<Q> extends Omit<ifm.IRequestQueryParams, "params"> {
  readonly params: Q;
}

export interface RequestOptions<Q, T = JsonValue> extends Omit<rm.IRequestOptions, "queryParameters"> {
  readonly queryParameters?: RequestQueryParams<Q>;
  readonly cache?: ICacheInterface<string, T>;
}

/**
 * Client access values or token string
 */
export type CredentialsFunction = () => Promise<
  | {
      readonly client_id: string;
      readonly client_secret: string;
      readonly grant_type: string;
      readonly scope: string;
    }
  | string
>;

export class LightcastAPIClient extends rm.RestClient {
  readonly skills = skillsAPI(this);
  readonly jpa = jobPostingsAPI(this);
  readonly cajpa = canadaJobPostingsAPI(this);
  readonly classification = classificationAPI(this);
  readonly careerPathways = careerPathwaysAPI(this);
  readonly salaryBoostingSkills = salaryBoostingSkillsAPI(this);
  readonly ddn = ddnAPI(this);
  readonly similarity = similarityAPI(this);
  readonly utils = { occupations: occupations(this) };

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
    public credentials?: CredentialsFunction,
    options: ifm.IRequestOptions = { keepAlive: true, allowRetries: true, maxRetries: 16 }
  ) {
    super(userAgent, undefined, [], options);
    this.client.handlers.push(this.bearerCredentialHandler);
  }

  setCredentials(creds: CredentialsFunction) {
    this.credentials = creds;
  }

  private async refreshToken() {
    if (!this.credentials) {
      throw new Error(`Credentials function is missing. Use setCredentials() or pass through the constructor`);
    }

    const value = await this.credentials();
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
  override async get<Q, R>(resource: string, options?: RequestOptions<Q, R>) {
    await this.refreshToken();

    const key = hash({ resource, ...options?.queryParameters });

    if (options?.cache && (await options?.cache.has(key))) {
      return (await options?.cache.get(key))!;
    }

    return super.get<R>(resource, options as rm.IRequestOptions).then((r) => {
      options?.cache?.set(key, r);
      return r;
    });
  }

  /**
   *
   * @param resource
   * @param body
   * @param options
   * @returns
   */
  async post<Q, B, R>(resource: string, body: B, options?: RequestOptions<Q, R>) {
    await this.refreshToken();

    const key = hash({ resource, body, ...options?.queryParameters });

    if (options?.cache && (await options?.cache.has(key))) {
      return (await options?.cache.get(key))!;
    }

    return super.create<R>(resource, body, options as rm.IRequestOptions).then((r) => {
      options?.cache?.set(key, r);
      return r;
    });
  }
}
