import { ErrorCode } from "../enums/ErrorCode";

export interface AppError {
  message: string;
  errorCode: (typeof ErrorCode)[keyof typeof ErrorCode];
}
