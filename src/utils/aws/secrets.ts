import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { privateKeyId, region } from "../../constants";

interface ParsedSecret {
  [key: string]: string
}

const client = new SecretsManagerClient({ region });

export const getPrivateKeySecret = async () =>
  Object.values((await getSecret(privateKeyId)))[0];

const getSecret = async (id: string): Promise<ParsedSecret> => {

  try {
    const command = new GetSecretValueCommand({ SecretId: id });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error('FML')
    }

    const parsedSecret: ParsedSecret = JSON.parse(response.SecretString)

    return parsedSecret
  } catch (e) {
    console.log(`Failed to get secret ${id}`, e)
    throw e
  }
}

