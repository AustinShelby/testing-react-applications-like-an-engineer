export type ApiReturn<TSuccess = any, TError = string> =
  | {
      error: false;
      data: TSuccess;
    }
  | {
      error: true;
      message: TError;
    }
  | void;
