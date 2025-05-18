export type ApiReturn<TSuccess = any, TError = string> = Promise<
  | {
      error: false;
      data: TSuccess;
    }
  | {
      error: true;
      message: TError;
    }
>;
