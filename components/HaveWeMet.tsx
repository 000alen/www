"use client";

import { createIntro } from "@/app/actions";
import { useTransitionRouter } from "next-view-transitions";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./Input";
import { withQueryClient } from "@/hocs/with-query-client";

function HaveWeMet() {
  const router = useTransitionRouter();
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

    onError: () => {
      toast({
        title: "Error",
        description: "Error creating intro",
      });
    },
  });

  return <>
    <h2 className="font-normal mb-2">have we met?</h2>
    <form className="mb-8" onSubmit={async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);
      const query = formData.get("query") as string;

      await mutateAsync(query);
    }}>
      <Input
        type="text"
        name="query"
        placeholder="Tell me a bit about yourself or where we might have crossed paths..."
        loading={isPending}
        action={{
          label: "→",
        }}
      />
    </form>
  </>;
}

export default withQueryClient(HaveWeMet);