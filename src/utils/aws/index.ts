import { getS3Service } from "./s3";
import { getSecretsService } from "./secrets";
import { getDynamoDBService } from "./dynamoDB";
import { IAWSServiceConfig } from "./aws.service.types";

export const getAWSService = ({
    secretsClient,
    s3Client,
    dynamoDbClient
}: IAWSServiceConfig) => ({
    s3: getS3Service(s3Client),
    dynamoDb: getDynamoDBService(dynamoDbClient),
    secrets: getSecretsService(secretsClient)
})