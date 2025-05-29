import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { prisma, setupTestDatabase, cleanupTestDatabase } from './setup';
import * as bcrypt from 'bcrypt';

describe('ExpensesController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const TEST_PASSWORD = 'password123';

  beforeAll(async () => {
    await setupTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Criar usuário diretamente no banco
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
      },
    });

    // Fazer login para obter o token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: TEST_PASSWORD,
      });

    console.log('Login response:', {
      status: loginResponse.status,
      body: loginResponse.body,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('access_token');
    token = loginResponse.body.access_token;
    console.log('Token obtido:', token);
  });

  beforeEach(async () => {
    await prisma.expense.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await cleanupTestDatabase();
  });

  describe('POST /expenses', () => {
    it('should create a new expense', async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      console.log('Criar despesa:', {
        token,
        status: response.status,
        body: response.body,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe('Test expense');
      expect(response.body.amount).toBe(100);
      expect(response.body.category).toBe('FOOD');
    });

    it('should fail to create expense without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      expect(response.status).toBe(401);
    });

    it('should fail to create expense with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /expenses', () => {
    beforeEach(async () => {
      // Criar algumas despesas para teste
      await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense 1',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense 2',
          amount: 200,
          date: new Date().toISOString(),
          category: 'FOOD',
        });
    });

    it('should get all expenses', async () => {
      const response = await request(app.getHttpServer())
        .get('/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should fail to get expenses without token', async () => {
      const response = await request(app.getHttpServer()).get('/expenses');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /expenses/:id', () => {
    let expenseId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      expenseId = response.body.id;
    });

    it('should get expense by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(expenseId);
      expect(response.body.description).toBe('Test expense');
    });

    it('should fail to get non-existent expense', async () => {
      const response = await request(app.getHttpServer())
        .get('/expenses/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /expenses/:id', () => {
    let expenseId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      expenseId = response.body.id;
    });

    it('should update expense', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Updated expense',
          amount: 200,
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(expenseId);
      expect(response.body.description).toBe('Updated expense');
      expect(response.body.amount).toBe(200);
    });

    it('should fail to update non-existent expense', async () => {
      const response = await request(app.getHttpServer())
        .patch('/expenses/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Updated expense',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /expenses/:id', () => {
    let expenseId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test expense',
          amount: 100,
          date: new Date().toISOString(),
          category: 'FOOD',
        });

      expenseId = response.body.id;
    });

    it('should delete expense', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      const getResponse = await request(app.getHttpServer())
        .get(`/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it('should fail to delete non-existent expense', async () => {
      const response = await request(app.getHttpServer())
        .delete('/expenses/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
