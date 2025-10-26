
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Auth API",
      version: "1.0.0",
      description: "Authentication API with JWT and Role-based Access Control",
    },
    servers: [
      {
        url: "http://localhost:5000", // adjust if using a different port
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // 👇 VERY IMPORTANT — make sure this path matches your route location
  apis: ["./src/routes/*.js"], // or ["./routes/*.js"] depending on folder structure
};

// Generate swagger specification
export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export { swaggerUi };
