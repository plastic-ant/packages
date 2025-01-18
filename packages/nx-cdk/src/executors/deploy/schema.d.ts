/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface DeployExecutorOptions {
  postTargets?: string[];
  /**
   * Command-line for executing your app or a cloud assembly directory e.g. 'node bin/my-app.js'
   */
  app?: string;
  /**
   * Include "aws:asset:*" CloudFormation metadata for resources that use assets
   */
  assetMetadata?: boolean;
  /**
   * Whether to build/publish assets in parallel.
   */
  assetParallelism?: boolean;
  /**
   * Whether to build all assets before deploying the first stack (useful for failing Docker builds)
   */
  assetPrebuild?: boolean;
  /**
   * Path to CA certificate to use when validating HTTPS
   * requests.
   */
  caBundlePath?: string;
  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   */
  changeSetName?: string;
  /**
   * Whether we are on a CI system
   */
  ci?: boolean;
  /**
   * Show colors and other style from console output
   */
  color?: boolean;
  /**
   * Maximum number of simultaneous deployments (dependency permitting) to execute.
   */
  concurrency?: number;
  /**
   * Additional context
   */
  context?: {
    [k: string]: string;
  };
  /**
   * enable emission of additional debugging information, such as creation stack
   * traces of tokens
   */
  debug?: boolean;
  /**
   * Force trying to fetch EC2 instance credentials
   */
  ec2Creds?: boolean;
  /**
   * Only perform action on the given stack
   */
  exclusively?: boolean;
  /**
   * Whether to execute the ChangeSet
   * Not providing `execute` parameter will result in execution of ChangeSet
   */
  execute?: boolean;
  /**
   * Always deploy, even if templates are identical.
   */
  force?: boolean;
  /**
   * Ignores synthesis errors, which will likely produce an invalid output
   */
  ignoreErrors?: boolean;
  /**
   * Use JSON output instead of YAML when templates are printed
   * to STDOUT
   */
  json?: boolean;
  /**
   * Perform context lookups.
   *
   * Synthesis fails if this is disabled and context lookups need
   * to be performed
   */
  lookups?: boolean;
  /**
   * Show relevant notices
   */
  notices?: boolean;
  /**
   * ARNs of SNS topics that CloudFormation will notify with stack related events
   */
  notificationArns?: string[];
  /**
   * Path to file where stack outputs will be written after a successful deploy as JSON
   */
  outputsFile?: string;
  /**
   * Additional parameters for CloudFormation at deploy time
   */
  parameters?: {
    [k: string]: string;
  };
  /**
   * Include "aws:cdk:path" CloudFormation metadata for each resource
   */
  pathMetadata?: boolean;
  /**
   * Use the indicated AWS profile as the default environment
   */
  profile?: string;
  /**
   * Display mode for stack activity events
   *
   * The default in the CLI is StackActivityProgress.BAR. But since this is an API
   * it makes more sense to set the default to StackActivityProgress.EVENTS
   */
  progress?: "bar" | "events";
  /**
   * Use the indicated proxy. Will read from
   * HTTPS_PROXY environment if specified
   */
  proxy?: string;
  /**
   * What kind of security changes require approval
   */
  requireApproval?: "any-change" | "broadening" | "never";
  /**
   * Reuse the assets with the given asset IDs
   */
  reuseAssets?: string[];
  /**
   * Role to pass to CloudFormation for deployment
   */
  roleArn?: string;
  /**
   * Rollback failed deployments
   */
  rollback?: boolean;
  /**
   * List of stacks to deploy
   */
  stacks?: string[];
  /**
   * Copy assets to the output directory
   *
   * Needed for local debugging the source files with SAM CLI
   */
  staging?: boolean;
  /**
   * Do not construct stacks with warnings
   */
  strict?: boolean;
  /**
   * Name of the toolkit stack to use/deploy
   */
  toolkitStackName?: string;
  /**
   * Print trace for stack warnings
   */
  trace?: boolean;
  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   */
  usePreviousParameters?: boolean;
  /**
   * show debug logs
   */
  verbose?: boolean;
  /**
   * Include "AWS::CDK::Metadata" resource in synthesized templates
   */
  versionReporting?: boolean;
  /**
   * emits the synthesized cloud assembly into a directory (default: cdk.out)
   */
  output?: string;
}
