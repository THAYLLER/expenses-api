import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { prisma, setupTestDatabase, cleanupTestDatabase } from './setup';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const TEST_PASSWORD = 'password123';

  beforeAll(async () => {
    await setupTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await cleanupTestDatabase();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test1@example.com',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      const token = response.body.access_token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should fail when email is already registered', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'test2@example.com',
        password: TEST_PASSWORD,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test2@example.com',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Email inválido');
    });

    it('should fail with password less than 6 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test3@example.com',
          password: '12345',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: 'test4@example.com',
          password: hashedPassword,
        },
      });
    });

    it('should login successfully and return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test4@example.com',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      const token = response.body.access_token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should fail with wrong password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test4@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(401);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: TEST_PASSWORD,
        });

      expect(response.status).toBe(400);
    });

    it('should fail with password less than 6 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test4@example.com',
          password: '12345',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Protected Routes', () => {
    let token: string;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: 'test5@example.com',
          password: hashedPassword,
        },
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test5@example.com',
          password: TEST_PASSWORD,
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('access_token');
      token = loginResponse.body.access_token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should fail to access protected route without token', async () => {
      const response = await request(app.getHttpServer()).get('/expenses');

      expect(response.status).toBe(401);
    });

    it('should fail to access protected route with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/expenses')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
