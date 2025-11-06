const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../src/data/students.json');

beforeEach(() => {
  fs.writeFileSync(dataPath, '[]'); // reset data before each test
});

describe('Students API', () => {
  it('should create and retrieve a student', async () => {
    const createRes = await request(app)
      .post('/students')
      .send({ name: 'Budi Santoso', age: 15 });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Budi Santoso');

    const id = createRes.body.id;
    const getRes = await request(app).get(`/students/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(id);
  });

  it('should paginate students', async () => {
    for (let i = 1; i <= 15; i++) {
      await request(app).post('/students').send({ name: `Student ${i}`, age: 10 + i });
    }

    const res = await request(app).get('/students?page=2&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    expect(res.body.meta.page).toBe(2);
  });

  it('should update a student', async () => {
    const create = await request(app).post('/students').send({ name: 'Andi', age: 13 });
    const id = create.body.id;
    const update = await request(app).put(`/students/${id}`).send({ age: 14 });
    expect(update.status).toBe(200);
    expect(update.body.age).toBe(14);
  });

  it('should delete a student', async () => {
    const create = await request(app).post('/students').send({ name: 'Delete Me', age: 11 });
    const id = create.body.id;
    const del = await request(app).delete(`/students/${id}`);
    expect(del.status).toBe(204);
  });
});
