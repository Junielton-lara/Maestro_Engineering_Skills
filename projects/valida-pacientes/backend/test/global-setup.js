const { execSync } = require('child_process');
const path = require('path');

module.exports = function globalSetup() {
  const url =
    process.env.DATABASE_URL_TEST ?? 'postgresql://valida:valida@localhost:54329/valida_pacientes_test';
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: url },
  });
};
