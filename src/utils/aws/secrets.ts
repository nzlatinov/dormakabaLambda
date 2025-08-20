import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { ParsedSecret } from "./aws.service.types";

export const getSecretsService = (client: SecretsManagerClient) => ({
  getSecret: getSecret(client)
})

const getSecret = (client: SecretsManagerClient) => async (id: string): Promise<ParsedSecret> => {

  try {
    const command = new GetSecretValueCommand({ SecretId: id });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error('FML')
    }

    const parsedSecret: ParsedSecret = JSON.parse(response.SecretString)

    return parsedSecret
  } catch (e) {
    console.error(`Failed to get secret ${id}`, e)
    throw e
  }
}

