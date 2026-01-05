import express from 'express';
import classificationRoutes from './routes/classificationRoutes.js';
import errorHandler from './middleware/errorHandler.js';


const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Service is running' });
});

app.use('/api', classificationRoutes);

app.use(errorHandler);

export default app;
