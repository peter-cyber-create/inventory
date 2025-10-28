const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../config/db');

describe('System API Tests', () => {
    beforeAll(async () => {
        // Connect to test database
        await sequelize.authenticate();
    });

    afterAll(async () => {
        // Close database connection
        await sequelize.close();
    });

    describe('Health Check', () => {
        test('GET /api/system/health should return system health', async () => {
            const response = await request(app)
                .get('/api/system/health')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.health).toHaveProperty('database');
            expect(response.body.health).toHaveProperty('server');
            expect(response.body.health).toHaveProperty('timestamp');
        });
    });

    describe('System Statistics', () => {
        test('GET /api/system/stats should return system statistics', async () => {
            const response = await request(app)
                .get('/api/system/stats')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.statistics).toHaveProperty('total_users');
            expect(response.body.statistics).toHaveProperty('total_assets');
            expect(response.body.statistics).toHaveProperty('total_vehicles');
        });
    });

    describe('File Upload', () => {
        test('POST /api/system/upload should handle file upload', async () => {
            const response = await request(app)
                .post('/api/system/upload')
                .attach('file', Buffer.from('test content'), 'test.txt')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.file).toHaveProperty('filename');
            expect(response.body.file).toHaveProperty('originalname');
        });

        test('POST /api/system/upload should reject invalid file types', async () => {
            const response = await request(app)
                .post('/api/system/upload')
                .attach('file', Buffer.from('test content'), 'test.exe')
                .expect(500);

            expect(response.body.status).toBe('error');
        });
    });

    describe('Rate Limiting', () => {
        test('Should enforce rate limits on auth endpoints', async () => {
            // Make multiple requests to trigger rate limit
            const promises = Array(6).fill().map(() => 
                request(app).post('/api/users/login')
            );
            
            const responses = await Promise.all(promises);
            const rateLimitedResponse = responses.find(res => res.status === 429);
            
            expect(rateLimitedResponse).toBeDefined();
        });
    });

    describe('Security Headers', () => {
        test('Should include security headers', async () => {
            const response = await request(app)
                .get('/api/system/health')
                .expect(200);

            expect(response.headers).toHaveProperty('x-content-type-options');
            expect(response.headers).toHaveProperty('x-frame-options');
        });
    });
});

describe('User Management Tests', () => {
    let authToken;
    let testUser;

    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'admin',
                password: 'admin123'
            });

        if (loginResponse.status === 200) {
            authToken = loginResponse.body.token;
        }
    });

    describe('User CRUD Operations', () => {
        test('GET /api/users should return users list', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(Array.isArray(response.body.users)).toBe(true);
        });

        test('POST /api/users should create new user', async () => {
            const newUser = {
                username: 'testuser',
                password: 'testpass123',
                firstname: 'Test',
                lastname: 'User',
                email: 'test@example.com',
                role: 'it',
                health_email: 'test@health.ug',
                phone: '123456789',
                designation: 'Test Role',
                department_id: 1,
                is_active: true
            };

            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newUser)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.user).toHaveProperty('id');
            testUser = response.body.user;
        });

        test('PATCH /api/users/:id should update user', async () => {
            if (!testUser) return;

            const updateData = {
                firstname: 'Updated',
                lastname: 'Name'
            };

            const response = await request(app)
                .patch(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.user.firstname).toBe('Updated');
        });

        test('PATCH /api/users/:id/password should change password', async () => {
            if (!testUser) return;

            const passwordData = {
                currentPassword: 'testpass123',
                newPassword: 'newpass123'
            };

            const response = await request(app)
                .patch(`/api/users/${testUser.id}/password`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(passwordData)
                .expect(200);

            expect(response.body.status).toBe('success');
        });

        test('DELETE /api/users/:id should delete user', async () => {
            if (!testUser) return;

            const response = await request(app)
                .delete(`/api/users/${testUser.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
        });
    });
});
