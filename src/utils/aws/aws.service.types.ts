
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { S3Client } from "@aws-sdk/client-s3";
import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface IAWSServiceConfig {
    secretsClient: SecretsManagerClient
    s3Client: S3Client
    dynamoDbClient: DynamoDBClient
}

export interface IAWSService {
    s3: IS3Service
    dynamoDb: IDynamoDBService
    secrets: ISecretsService
}

export interface IDynamoDBService {
    putItem: (TableName: string, Item: Record<string, AttributeValue>) => Promise<void>
}

export interface IS3Service {
    readFile: (bucket: string, key: string) => Promise<string>
}

export interface IS3Service {
    readFile: (bucket: string, key: string) => Promise<string>
}

export interface ISecretsService {
    getSecret: (id: string) => Promise<ParsedSecret>
}
export type ParsedSecret = Record<string, string>
