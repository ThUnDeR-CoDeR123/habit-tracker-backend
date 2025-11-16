import express from 'express';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import habitRoutes from './routes/habitRoutes';
import trackingRoutes from './routes/trackingRoutes';

const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api", habitRoutes);
app.use("/api", trackingRoutes);

connectDB();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


if (process.env.NODE_ENV === 'test') {
  server.close = () => server.close();
}

export default app;
export { server };