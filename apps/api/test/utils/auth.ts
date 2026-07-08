import * as request from 'supertest';

export const getAuthToken = async (server: any, email: string = 'test@atlas.in', pass: string = 'password123') => {
  // 1. Ensure the user exists (using your seed-admin endpoint for testing)
  await request(server)
    .post('/auth/seed-admin')
    .send({ email, pass });

  // 2. Login
  const res = await request(server)
    .post('/auth/login')
    .send({ email, pass });

  if (res.status !== 201 && res.status !== 200) {
    throw new Error(`Failed to get auth token: ${JSON.stringify(res.body)}`);
  }

  return res.body.token || res.body.accessToken;
};
