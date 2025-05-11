export type ApiReturn<TSuccess, TError = string> =
  | {
      error: false;
      data: TSuccess;
    }
  | {
      error: true;
      message: TError;
    };
