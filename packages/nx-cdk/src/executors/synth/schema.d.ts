/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Options to use with cdk synth
 */
export interface SynthExecutorOptions {
  postTargets?: string[];
  /**
   * Include "aws:asset:*" CloudFormation metadata for resources that use assets
   */
  assetMetadata?: boolean;
  /**
   * Path to CA certificate to use when validating HTTPS
   * requests.
   */
  caBundlePath?: string;
  /**
   * Show colors and other style from console output
   */
  color?: boolean & string;
  /**
   * Additional context
   */
  context?: string;
  /**
   * enable emission of additional debugging information, such as creation stack
   * traces of tokens
   */
  debug?: boolean;
  /**
   * Force trying to fetch EC2 instance credentials
   */
  ec2Creds?: boolean & string;
  /**
   * Only synthesize the given stack
   */
  exclusively?: boolean;
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
   * Include "aws:cdk:path" CloudFormation metadata for each resource
   */
  pathMetadata?: boolean;
  /**
   * Use the indicated AWS profile as the default environment
   */
  profile?: string;
  /**
   * Use the indicated proxy. Will read from
   * HTTPS_PROXY environment if specified
   */
  proxy?: string;
  /**
   * Do not output CloudFormation Template to stdout
   */
  quiet?: boolean & string;
  /**
   * Role to pass to CloudFormation for deployment
   */
  roleArn?: string;
  /**
   * List of stacks to deploy
   */
  stacks?: string & string[];
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
   * Print trace for stack warnings
   */
  trace?: boolean;
  /**
   * After synthesis, validate stacks with the "validateOnSynth"
   * attribute set (can also be controlled with CDK_VALIDATION)
   */
  validation?: boolean & string;
  /**
   * show debug logs
   */
  verbose?: boolean;
  /**
   * Include "AWS::CDK::Metadata" resource in synthesized templates
   */
  versionReporting?: boolean;
}
