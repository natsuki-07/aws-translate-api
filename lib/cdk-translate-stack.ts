import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkTranslateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const translateLambdaRole = new iam.Role(this, 'Role', {
      roleName: 'lambda-allow-translate',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'), 
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('TranslateFullAccess')
      ]
    });

    const lambda = new NodejsFunction(this, 'translate', {
      entry: 'lib/lambda/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      role: translateLambdaRole
    });

    const api = new RestApi(this, 'ServerlessRestApi');
    const word = api.root.addResource('translate')
    word.addMethod('POST', new LambdaIntegration(lambda))
  }
}
