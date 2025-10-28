import { Request } from 'express';

export interface AuthedRequest extends Request {
  auth: {
    sub: string;
    orgId: string;
    role: string;
  };
}
