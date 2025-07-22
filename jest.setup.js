const envPath = process.env.DOTENV_CONFIG_PATH || '.env.test';

console.log({ envPath })
require('dotenv').config({ path: envPath });