import express from 'express';

const app = express();

app.use(express.json());

app.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  const tokens = {
    access_token: '123',
    refresh_token: '456',
  };

  if (email == 'example@test.com' && password == 'testtest') {
    res.json(tokens);
  } else if (email == 'example@test.com' && password == 'currentuser') {
    tokens.access_token = '321';
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
    res.status(401).json({msgs: ['This is wrong', 'That is wrong']});
  }
});

app.get('/auth/currentuser', (req, res) => {
  if (req.headers['authorization'] == 'Bearer 123') {
    const user = {username: 'example_test123', display_name: 'Example User'};

    res.json(user);
  } else {
    res.status(401).json({msg: 'Unauthenticated'});
  }
});

export default app;
