// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const { swaggerUi, swaggerSpec } = require('../src/config/swagger'); // ✅ Import Swagger
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const newbookingRoutes = require("./routes/newbookingRoutes");

app.use(express.json());

// ✅ Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/newbooking", newbookingRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
