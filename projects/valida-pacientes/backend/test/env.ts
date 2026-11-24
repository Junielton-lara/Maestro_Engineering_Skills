process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL_TEST ?? 'postgresql://valida:valida@localhost:54329/valida_pacientes_test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-32-characters-min';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.COOKIE_SECURE = 'false';
process.env.PORT = '3001';
