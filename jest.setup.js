const envPath = process.env.DOTENV_CONFIG_PATH || '.env.test';
require('dotenv').config({ path: envPath });