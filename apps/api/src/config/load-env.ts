import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(dirname, '../..');
const workspaceRoot = path.resolve(apiRoot, '../..');

dotenv.config({ path: path.join(apiRoot, '.env'), quiet: true });
dotenv.config({ path: path.join(workspaceRoot, '.env'), quiet: true });
