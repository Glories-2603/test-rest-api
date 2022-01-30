const pool = require('./client/connect/config');
const express = require('express');
const routes = require('./client/users/router');
const app = express();


// GET
// Display all posts
app.get('/posts', (request, response) => {
  pool.query('SELECT * FROM posts', (error, result) => {
      if(error) return response.send(error);
      if(!result || result == null || result.length<=0){
        response.send("Запрос не выполнен, пост не найден.");
      } else {
        response.send(result);
      }
  });
});
// Display a single posts by ID
app.get('/posts/:id', (request, response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM posts WHERE id = ?', id, (error, result) => {
      if (error) return response.send(error);
        if(!result || result == null || result.length<=0){
          response.send("Запрос не выполнен, пост не найден.");
        } else {
          response.send(result);
        }
  });
});
// POST
// Add a new post
app.post('/posts', (request, response) => {
  pool.query('INSERT INTO posts SET text', request, (error, result) => {
    if (error) return response.send(error);

    response.status(201).send(`Пост добавлен, ID: ${result.insertId}`);
  });
});

// DELETE
// Delete a post 
app.delete('/posts/:id', (request, response) => {
  const id = request.params.id;
  
  pool.query('SELECT * FROM posts WHERE id = ?', id, (error, result) => {
        if (error) return response.send(error);
          if(!result || result == null || result.length<=0){
            response.send("Запрос не выполнен, пост не найден.");
          } else {
            pool.query('DELETE FROM posts WHERE id = ?', id, (error, result) => {
              if (error) return response.send(error);
          
                response.send("Пост удален");
            });
          }
    });
});

// PUT
// Update an existing posts
app.put('/posts/:id', (request, response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM posts WHERE id = ?', id, (error, result) => {
    if (error) return response.send(error);
      if(!result || result == null || result.length<=0){
        response.send("Запрос не выполнен, пост не найден.");
      } else {
        pool.query('UPDATE posts SET ? WHERE id = ?', [request.body, id], (error, result) => {
          if (error) return response.send(error);
            response.send("Пост обновлен");
        });
      }
});
});

app.use(express.json());
app.use(routes);
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.listen(3002,() => console.log('Server is running on port 3002'));
