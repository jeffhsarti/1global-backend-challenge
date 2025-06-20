import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Device API',
      version: '1.0.0',
      description: 'API for managing devices',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL do seu servidor local
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Device: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            brand: { type: 'string' },
            state: {
              type: 'string',
              enum: ['AVAILABLE', 'IN_USE', 'INACTIVE'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/http/controllers/**/*.ts'],
});
