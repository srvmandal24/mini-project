import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';


// App config
const app = express();
const port = process.env.PORT || 8000;
connectdb();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/student", authMiddleware, studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);


app.get("/", (req, res) => {
    res.send("Backend Running.");
})

app.listen(port, () => {
    console.log("Listening to port : " + port)
})