import { ResultEnum } from './enum';

export interface Result<T = any> {
  code: ResultEnum;
  message: string;
  data?: T;
}
