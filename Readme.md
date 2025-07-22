# AWS Lambda Function

This project contains an AWS Lambda function written in **Node.js** and deployable via AWS CloudFormation

## 🚀 Features

- Built with Node.js
- Deployed to AWS Lambda
- Local testing support with mocked events and environment variables
- DynamoDB integration

## Deployment

There are two scripts run with ```npm run deploy```: 
 - createStack.sh - creates the ressources needed 
 - publishVersion.sh - builds the app and uploads it to the already created Lambda function

 To run the scripts you need to copy .env.test into .evn and replace values with real ones

 What you can do locally without deploying is somewhat limited. There is a runLocal.ts file to call the function.. It only works if the other ressources exist.
 
 I suppose you could explore using a LocalStack,
 but this is out of scope for this readme.

 Also the secret was created manually in the console


## Prerequisites

- Node.js
- npm
- AWS CLI (configured with credentials), so you can authenticate directly or assume a role in order to create ressources

## Installation

- npm install
- Run aws configure and setup credentials
- Run the scripts for deploying stack and deploying version

(Locally, without the associated ressources you can you can only run the tests)

## Tests

Even for the tests (integration) you actually need a deployed version.

But you can run the unit tests no problem.

## Call to live deployed function : 

With existing public bucket: https://ausagtm6ewapztua6m6fqgwzye0uqnkz.lambda-url.eu-north-1.on.aws/?bucket=dormakaba-test-07-25&&key=cert.pem

With bucket from deploy script: https://ausagtm6ewapztua6m6fqgwzye0uqnkz.lambda-url.eu-north-1.on.aws/?bucket=dormakaba-test-nikola&&key=cert.pem

---
