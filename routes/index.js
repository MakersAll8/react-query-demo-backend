const express = require('express');
const { db } = require('../postgres/db');
const {v4: uuidv4} = require('uuid');
const randomstring = require('randomstring');

const citiesRouter = express.Router();

citiesRouter.get('/', async (req, res, next)=>{
  console.log('get cities ran')
  const cities = await db.any('SELECT * FROM cities ORDER BY country, province, city')
  return res.send(cities)
});

citiesRouter.put('/', async (req, res, next)=>{
  const {id, city, province, country, zip} = req.body;
  const updatedCity = await db.one(
    'UPDATE cities SET city = $1, province = $2, country = $3, zip = $4 WHERE id = $5 RETURNING id, city, province, country, zip',
    [city, province, country, zip, id]
  );
  return res.send(updatedCity);
});

citiesRouter.get('/:id', async (req, res, next)=>{
  const {id} = req.params
  const city = await db.one('SELECT * FROM cities WHERE id = $1', [id])
  return res.send(city)
});

citiesRouter.get('/seed/:count?', async (req, res, next)=>{
  const created = [];
  const count = req.params.count || 1;
  for(let i = 0; i < count; i++){
    const id = await db.one(
      'INSERT INTO cities(id, city, province, country, zip) VALUES($1, $2, $3, $4, $5) RETURNING id', 
      [uuidv4(), randomstring.generate(7), randomstring.generate(8), randomstring.generate(5), randomstring.generate(6)]
    )
    created.push(id);
  }
  return res.send(created)
});

citiesRouter.get('/:limit/:offset', async (req, res, next)=>{
  const {limit, offset} = req.params
  const cities = await db.any('SELECT * FROM cities ORDER BY country, province, city LIMIT $1 OFFSET $2', [limit, offset])
  return res.send(cities)
});

module.exports = {citiesRouter};