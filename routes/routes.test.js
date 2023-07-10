process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

let item = { name: 'snickers', price: .99 };
let updatedItem = { name: 'twix', price: .88 };

beforeEach(() => {
    items.push(item);
});

afterEach(() => {
    items.length = 0;
});

describe('GET /items', () => {
    test('Get all items', async () => {
        const res = await request(app).get('/items');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ items: [item] });
    });

    test('Wrong path', async () => {
        const res = await request(app).get('/item');
        expect(res.status).toBe(404);
    });
});

describe('GET /items/:name', () => {
    test('Get Item', async () => {
        const res = await request(app).get(`/items/${item.name}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ item: item });
    });

    test('Wrong item', async () => {
        const res = await request(app).get(`/items/${item}d`);
        expect(res.status).toBe(404);
    });
});

describe('POST /items', () => {
    test('Create item', async () => {
        const res = await request(app).post('/items').send({ name: 'twix', price: 1 });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ added: { name: 'twix', price: 1 } });
    });
    test('Create item with no name', async () => {
        const res = await request(app).post('/items').send({ price: 1 });
        expect(res.status).toBe(404);
    });
});

describe('PATCH /items/:name', () => {
    test('Update item', async () => {
        const res = await request(app).patch(`/items/${item.name}`).send(updatedItem);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ updated: updatedItem });
    });
    test('Update item not found', async () => {
        const res = await request(app).patch('/items/fds').send(updatedItem);
        expect(res.status).toBe(404);
    });
});

describe('DELETE /items/:name', () => {
    test('Delete Item', async () => {
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'DELETED' });
    });
    test('Deleted item not found', async () => {
        const res = await request(app).delete('/items/fds');
        expect(res.status).toBe(404);
    });
});