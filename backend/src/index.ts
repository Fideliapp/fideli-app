import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routers from './routers';
import ErrorHandler from './middleware/error';

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(ErrorHandler);

app.use('/api', routers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
