const express = require('express');
const route = new express.Router();
const ExpressErrors = require('../expressErrors');
const items = require('../fakeDb');

route.get('/', (req, res) => {
    return res.json({ items });
});

route.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) {
            throw new ExpressErrors('Name and price must be inputted', 400);
        }
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({
            added: newItem
        });
    } catch (e) {
        return next(e);
    }
});

route.get('/:name', (req, res, next) => {
    try {
        const item = items.find(item => item.name === req.params.name);
        if (item === undefined) {
            throw new ExpressErrors('Item not found', 404);
        }
        return res.status(200).json({ item: item });
    } catch (e) {
        return next(e);
    }
});

route.patch('/:name', (req, res, next) => {
    try {
        const item = items.find(item => item.name === req.params.name);
        if (item === undefined) {
            throw new ExpressErrors('Item not found', 404);
        }
        return res.status(200).json({
            updated: {
                name: req.body.name,
                price: req.body.price
            }
        });
    } catch (e) {
        return next(e);
    }
});

route.delete('/:name', (req, res, next) => {
    try {
        const item = items.findIndex(item => item.name === req.params.name);
        if (item === -1) {
            throw new ExpressErrors('Item not found', 404);
        }
        items.splice(item, 1);
        return res.json({ message: 'DELETED' });
    } catch (e) {
        return next(e);
    }
});



module.exports = route;