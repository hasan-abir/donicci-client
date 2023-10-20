import express from 'express';
import demoProducts from '../helpers/demoProducts.json';
import demoCategories from '../helpers/demoCategories.json';
import {Product} from '../../../components/ProductItem';
import {Category} from '../../../components/CategoryItem';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  const tokens = {
    access_token: '123',
    refresh_token: '456',
  };

  if (email === 'example@test.com' && password === 'testtest') {
    res.json(tokens);
  } else if (email === 'example@test.com' && password === 'currentuser') {
    tokens.access_token = '321';
    tokens.refresh_token = '654';
    res.json(tokens);
  } else {
    res.status(401).json({msg: 'Unauthenticated'});
  }
});

app.post('/auth/register', (req, res) => {
  const {user} = req.body;

  const {display_name, username, email, password} = user;

  const tokens = {
    access_token: '123',
    refresh_token: '456',
  };

  if (
    display_name === 'Example User' &&
    username === 'example_test123' &&
    email === 'example@test.com' &&
    password === 'testtest'
  ) {
    res.json(tokens);
  } else {
    res.status(400).json({msgs: ['This is wrong', 'That is wrong']});
  }
});

app.get('/auth/currentuser', (req, res) => {
  if (req.headers['authorization'] === 'Bearer 123') {
    const user = {username: 'example_test123', display_name: 'Example User'};

    res.json(user);
  } else {
    res.status(401).json({msg: 'Unauthenticated'});
  }
});

app.post('/auth/refresh-token', (req, res) => {
  const {token} = req.body;

  if (token === '654') {
    res.json({
      access_token: '123',
      refresh_token: '456',
    });
  } else {
    res.status(401).json({msg: 'Unauthenticated'});
  }
});

app.delete('/auth/logout', (req, res) => {
  if (req.headers['authorization'] === 'Bearer 123') {
    res.sendStatus(200);
  } else {
    res.status(401).json({msg: 'Unauthenticated'});
  }
});

app.get('/products', (req, res) => {
  const productsFromDB = demoProducts.products as Product[];
  let products: Product[] = [];

  const next = req.query.next;

  switch (next) {
    case productsFromDB[productsFromDB.length - 1].updated_at:
      products = [];
      break;
    case productsFromDB[4].updated_at:
      products = productsFromDB.slice(5, productsFromDB.length);
      break;
    default:
      products = productsFromDB.slice(0, 5);
  }

  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const productsFromDB = demoProducts.products as Product[];
  let product: Product | undefined;

  product = productsFromDB.find(item => item._id === req.params.id);

  if (req.params.id === productsFromDB[1]._id) {
    product = undefined;
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({msg: 'Product not found'});
  }
});

app.get('/categories', (req, res) => {
  const categoriesFromDB = demoCategories.categories as Category[];
  let categories: Category[] = [];

  const next = req.query.next;

  switch (next) {
    case categoriesFromDB[categoriesFromDB.length - 1].updated_at:
      categories = [];
      break;
    case categoriesFromDB[9].updated_at:
      categories = categoriesFromDB.slice(10, categoriesFromDB.length);
      break;
    default:
      categories = categoriesFromDB.slice(0, 10);
  }

  res.json(categories);
});

app.get('/categories/:id', (req, res) => {
  const categoriesFromDB = demoCategories.categories as Category[];
  let category: Category | undefined;

  category = categoriesFromDB.find(item => item._id === req.params.id);

  if (req.params.id === categoriesFromDB[1]._id) {
    category = undefined;
  }

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({msg: 'Category not found'});
  }
});

export default app;
