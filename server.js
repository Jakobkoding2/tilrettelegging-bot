import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { processDocuments } from './lib/documentProcessor.js';
import { generateRecommendations, generateStructuredOutput } from './lib/outputGenerator.js';
import { scheduleFileDeletion, cleanupFile } from './lib/security.js';
import { logConsent } from './lib/gdprCompliance.js';
import { getUniversities, getUniversity, getUniversityRules } from './lib/knowledge/index.js';
import { createJob, getJob, updateJob, getAllJobs, cleanupOldJobs } from './lib/jobQueue.js';
import { initializeVault, vaultUpload } from './lib/vault.js';
import feedbackRouter from './lib/feedbackRouter.js';
import { oauthRequired, buildUniversityRateLimiter } from './lib/auth/oauthMiddleware.js';
import { issueToken } from './lib/auth/tokenService.js';
import logger from './lib/logger.js';
import { register } from './lib/metrics.js';
import { startWorker } from './lib/worker.js';
import { scanFile, initClamAV } from './lib/malwareScanner.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
initClamAV();
app.use(helmet());
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',') }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1', feedbackRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Server is running' }));
app.get('/metrics', async (_req, res) => { res.set('Content-Type', register.contentType); res.end(await register.metrics()); });
app.post('/v1/auth/token', express.json(), (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.body?.apiKey;
    const { token, university } = issueToken({ apiKey });
    res.json({ access_token: token, token_type: 'Bearer', expires_in: process.env.JWT_EXPIRY || '24h', university: { id: university.id, name: university.name } });
  } catch {
    res.status(401).json({ error: 'Invalid apiKey' });
  }
});
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
