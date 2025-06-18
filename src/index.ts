import express from 'express';
import { config } from 'dotenv';
import { SecretManager } from '@config/secrets/secret-manager';
import { EnvSecretProvider } from '@config/secrets/implementations/env-secret-provider';

config();

const secretManager = new SecretManager(new EnvSecretProvider());

const app = express();
app.use(express.json());

// Health‐check
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = secretManager.get('PORT');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
