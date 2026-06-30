import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(dirname, '.env') });
dotenv.config({ path: path.join(dirname, '../../.env') });

export default defineConfig({
  schema: path.join(dirname, 'prisma', 'schema.prisma'),
});
