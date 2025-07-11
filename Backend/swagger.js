const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HeroFlip API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./routes/*.js'],        // cartelle dove sono definite le rotte
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;