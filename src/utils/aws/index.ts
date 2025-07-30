import { getS3Service, S3Service } from "./s3";
import { getSecretsService, SecretsService } from "./secrets";
import { DynamoDBService, getDynamoDBService } from "./dynamoDB";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

interface AWSServiceConfig {
    secretsClient: SecretsManagerClient
    s3Client: S3Client
    dynamoDbClient: DynamoDBClient
}

export interface AWSService {
    s3: S3Service
    dynamoDb: DynamoDBService
    secrets: SecretsService
}

export const getAWSService = ({
    secretsClient,
    s3Client,
    dynamoDbClient
}: AWSServiceConfig) => ({
    s3: getS3Service(s3Client),
    dynamoDb: getDynamoDBService(dynamoDbClient),
    secrets: getSecretsService(secretsClient)
})