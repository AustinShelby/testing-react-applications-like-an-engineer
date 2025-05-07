"use client";

import { FC, PropsWithChildren } from "react";

export const UserProvider: FC<
  PropsWithChildren<{ username: string | undefined }>
> = ({ username, children }) => {
  return <>{children}</>;
};
