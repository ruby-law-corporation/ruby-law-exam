import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(dirname, '../..');
const workspaceRoot = path.resolve(apiRoot, '../..');

// Local app-level .env takes precedence, then the shared workspace-root .env.
dotenv.config({ path: path.join(apiRoot, '.env') });
dotenv.config({ path: path.join(workspaceRoot, '.env') });
