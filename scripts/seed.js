import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import seedAdmin from '../lib/seeders/adminSeeder.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

async function runSeeders() {
  console.log('Starting seeding...');
  await seedAdmin();
  console.log('Seeding completed!');
  process.exit(0);
}

runSeeders().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
}); 