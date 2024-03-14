import express from 'express';
const app = express();
app.listen(3300, () => {
  console.log('Server running at http://localhost:3300');
});
