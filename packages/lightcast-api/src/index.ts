import jobPostingsAPI from "./lib/jpa";
import canadaJobPostingsAPI from "./lib/ca-jpa";
import classificationAPI from "./lib/classification";
import { client as skillsClient } from "./lib/skills";
import careerPathwaysAPI from "./lib/career-pathways";
import salaryBoostingSkillsAPI from "./lib/salary-boosting-skills";
import ddnAPI from "./lib/ddn";
import similarityAPI from "./lib/similarity";
import occupations from "./lib/utils/occupations";
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
//import axiosRetry, { IAxiosRetryConfig } from "axios-retry";

export interface RequestOptions<Q, R> extends Omit<AxiosRequestConfig<R>, "params"> {
  params?: Q;
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

export class LightcastAPIClient {
  readonly skills = skillsClient;
  readonly jpa = jobPostingsAPI(this);
  readonly cajpa = canadaJobPostingsAPI(this);
  readonly classification = classificationAPI(this);
  readonly careerPathways = careerPathwaysAPI(this);
  readonly salaryBoostingSkills = salaryBoostingSkillsAPI(this);
  readonly ddn = ddnAPI(this);
  readonly similarity = similarityAPI(this);
  readonly utils = { occupations: occupations(this) };

  readonly client: AxiosInstance;
  private token: string | undefined = undefined;
  //private expiresIn: number = 0;

  /**
   *
   * @param credentials
   * @param args - Axios constructor arguments
   */
  constructor(public credentials?: CredentialsFunction, ...args: Parameters<typeof axios.create>) {
    this.client = axios.create({ responseType: "json", ...args });
    this.applyInterceptors(this.skills);
  }

  /**
   *
   * @param instance
   */
  private applyInterceptors(instance: AxiosInstance) {
    instance.interceptors.request.use(
      async (config) => {
        await this.refreshToken();
        config.headers = config.headers.concat({ ...config.headers, Authorization: `Bearer ${this.token}` });
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalConfig = err.config;

        if (err.response) {
          if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            await this.refreshToken();
            originalConfig.headers = originalConfig.headers.concat({
              ...originalConfig.headers,
              Authorization: `Bearer ${this.token}`,
            });
            return instance(originalConfig);
          }
        }

        return Promise.reject(err);
      }
    );
  }

  /**
   *
   * @param creds
   */
  setCredentials(creds: CredentialsFunction) {
    this.credentials = creds;
  }

  /**
   *
   */
  private async refreshToken() {
    if (!this.credentials) {
      throw new Error(`Credentials function is missing. Use setCredentials() or pass through the constructor`);
    }

    const value = await this.credentials();
    if (typeof value === "string") {
      this.client.defaults.headers.common = { Authorization: `Bearer ${value}` };
      this.token = value;
    } else {
      const response = await this.client.post("https://auth.emsicloud.com/connect/token", new URLSearchParams(value));
      const { /*expires_in,*/ access_token } = response.data;
      //this.expiresIn = Date.now() + expires_in * 1000;
      this.client.defaults.headers.common = { Authorization: `Bearer ${access_token}` };
      this.token = access_token;
      /*if (Date.now() >= this.expiresIn) {
        const response = await this.client.post("https://auth.emsicloud.com/connect/token", new URLSearchParams(value));
        const { expires_in, access_token } = response.data;
        this.expiresIn = Date.now() + expires_in * 1000;
        this.client.defaults.headers.common = { Authorization: `Bearer ${access_token}` };
        this.token = access_token;
      }*/
    }
  }

  /**
   *
   * @param resource
   * @param options
   * @returns
   */
  async get<Q, R>(resource: string, options?: RequestOptions<Q, void>) {
    await this.refreshToken();
    return this.client.get<R, AxiosResponse<R>>(resource, options);
  }

  /**
   *
   * @param resource
   * @param body
   * @param options
   * @returns
   */
  async post<Q, B, R>(resource: string, body: B, options?: RequestOptions<Q, B>) {
    await this.refreshToken();
    return this.client.post<R, AxiosResponse<R>>(resource, body, options);
  }
}
