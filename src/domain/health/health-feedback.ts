import {
  HEALTH_STATUS,
  DATABASE_CONNECTION_STATUS,
} from '@config/enums/health';

export interface HealthFeedback {
  status: HEALTH_STATUS;
  metadata: {
    database: DATABASE_CONNECTION_STATUS;
  };
}
