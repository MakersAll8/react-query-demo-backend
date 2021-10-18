const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const DBMigrate = require('db-migrate');
const { citiesRouter } = require('./routes');

// run migration scripts
(async () => {
  const dbm = DBMigrate.getInstance(true);
  try {
    console.log('starting migration');
    await dbm.up();
    console.log('completed migration');
  } catch (e) {
    console.log(e);
  }
})();

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// use cookieParse middleware to append cookie to req.cookies
app.use(cookieParser());

// use router
const router = express.Router();

router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
  res.send('Hello World with time logged in console!');
});

app.use('/log-time', router);

// no router
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/error', (req, res, next) => {
  res.status(400).send({
    errors: [
      {
        id: 'fp.error.2',
        values: { count: 100, dollar: 500 },
        message: 'lorem ipsum 0',
      },
      { id: 'fp.error.2', message: 'lorem ipsum 1' },
    ],
  });
});

app.use('/cities', citiesRouter);

// error handler
app.use(function (err, req, res, next) {
  console.log(`default error handler invoked. Error: ${err}`);
  res.status(400).send(err.message);
});

// process.on('unhandledRejection', (e) => {
//   console.log(e);
// });
// process.on('uncaughtException', (e) => {
//   console.log(e);
// });

// Route handlers
// var cb0 = function (req, res, next) {
//   console.log('CB0')
//   next()
// }
// var cb1 = function (req, res, next) {
//   console.log('CB1')
//   next()
// }
// var cb2 = function (req, res) {
//   res.send('Hello from C!')
// }
// app.get('/example/c', [cb0, cb1, cb2])

// chain-able routes
// app.route('/book')
//   .get(function (req, res) {
//     res.send('Get a random book')
//   })
//   .post(function (req, res) {
//     res.send('Add a book')
//   })
//   .put(function (req, res) {
//     res.send('Update the book')
//   })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
