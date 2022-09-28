const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3084;
const clientPort = 3000;
global.__basedir = __dirname; //base directory
var corsOptions = {
  'origin': `http://localhost:${clientPort}`
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//declaire db models
const db = require('./models');
// useRoutes has to be us after db synced
db.sequelize.sync().then(() => {
  useRoutes();
});

// drop existing table an resync db
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//   useRoutes();
// });

//test connection
app.get('/', (req, res) => {
  res.json({
    message: 'Test success!'
  })
});

//routes
function useRoutes() {
  console.log('use routes');
  require('./routes/categories.routes')(app);
  require('./routes/products/dimensions.routes')(app);
  require('./routes/products/products.routes')(app);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
