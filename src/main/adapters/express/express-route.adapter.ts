import { type Request, type Response } from 'express';
import { type IController } from './../../../presentation/protocols/controller';

type AdaptRoute = (req: Request, res: Response) => Promise<void>;

export const adaptRoute = (controller: IController): AdaptRoute => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest = {
      body: req.body
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
