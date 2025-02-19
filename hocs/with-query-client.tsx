import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";

const queryClient = new QueryClient();

export const withQueryClient = <P extends object>(Component: FC<P>) => (props: P) => (
  <QueryClientProvider client={queryClient}>
    <Component {...props} />
  </QueryClientProvider>
);
