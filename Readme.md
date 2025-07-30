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





Prior Information
In order to carry out the tasks, you should have a minimal node.js setup ready in your local environment. 
No AWS or any external account/setup is necessary.

In the task, you will be asked to write/run node.js scripts locally using Javascript or Typescript.
Task - Testing language/library usage & research with little AWS knowledge
Write a node.js script (that will run on AWS Lambda):
    • Reading an x509 Certificate(that is in PEM format) from S3(doesn't matter where in S3)
    • Extracts public key from the certificate
    • Extracts the CommonName from the certificate subject
    • Generates a private key using RSA algorithm
    • Signs the Public Key you have extracted with the private key you have generated
    • Writes the encrypted content to DynamoDB with Hash Key equals CommonName
    • Write tests to cover the functionality
Bonus (if you finish earlier than expected):
    • Write README explaining how to run this locally
    • Write CloudFormation template for creating S3 and DynamoDB needed for this script.
    • Write IAM Policy template with min requirements for accessing s3 and DynamoDB.
    • Extra Bonus: use ECC algorithm instead of RSA
Remarks:
    • Make sure node.js script is tailored for lambda with valid handler function for triggering
    • You can use any library in node.js for certificates and for AWS clients
    • Script, templates, policies won't need to be deployable or executable right away. Just the content is important. They don't need to be working really on AWS or be perfect
    • Both Javascript and Typescript are accepted
    • Commit index.js/ts and other files into a public GitHub repo. 
    • Feel free to improvise or make assumptions if you feel stuck.
Reviewing/Expectation:
    • The goal of the task is not to come up with something perfectly working or production-ready. 
    • The important points are 
        ◦ If you could find the required libraries and read their documentation to find out the required functions to solve your problem
        ◦ If you can search and understand the basic concepts of what is unknown to you