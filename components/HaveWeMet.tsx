"use client";

import { createIntro } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FC } from "react";

const queryClient = new QueryClient();

const withQueryClient = <P extends object>(Component: FC<P>) => (props: P) => (
  <QueryClientProvider client={queryClient}>
    <Component {...props} />
  </QueryClientProvider>
);

const HaveWeMet = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    mutateAsync,
    isPending,
  } = useMutation({
    mutationKey: ["have-we-met"],
    mutationFn: async (query: string) => {
      const state = await createIntro(query);

      if (state.type === "error") throw new Error(state.error);

      return state;
    },

    onSuccess: (data) => {
      if (data.type !== "success") throw new Error("Invalid state");

      toast({
        title: "Intro created",
        description: "Intro created successfully",
      });

      router.push(`/intro/${data.slug}`);
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: "Error creating intro",
      });
    },
  });

  return <>
    <h2 className="font-normal mb-2">have we met?</h2>
    <form className="mb-8 relative" onSubmit={async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);
      const query = formData.get("query") as string;

      await mutateAsync(query);
    }}>
      <input
        type="text"
        name="query"
        placeholder="Tell me a bit about yourself or where we might have crossed paths..."
        className="w-full bg-[#111111] border border-[#333333] text-[#909090] p-2 rounded-md text-xs focus:outline-none focus:border-[#555555] transition-colors"
        disabled={isPending}
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-xs bg-[#222222] text-[#909090] hover:bg-[#333333] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : (
          "→"
        )}
      </button>
    </form>
  </>;
}

export default withQueryClient(HaveWeMet);