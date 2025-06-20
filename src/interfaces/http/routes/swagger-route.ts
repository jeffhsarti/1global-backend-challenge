import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@docs/swagger';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { router as swaggerRoute };
