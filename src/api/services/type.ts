export interface CommonResponse {
  code: string;
  context: {
    [key: string]: any;
  };
  errorData?: string;
  message?: string;
}
