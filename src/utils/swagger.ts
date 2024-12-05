import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for the Next.js project",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/app/api/**/*.ts"], // المسار يجب أن يتوافق مع ملفاتك
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
