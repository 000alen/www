'use client';

import { requestEmail } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import { withQueryClient } from "@/hocs/with-query-client";

function EmailRequest({ slug }: { slug: string }) {
  const { toast } = useToast();

  const {
    mutateAsync,
    isPending,
  } = useMutation({
    mutationKey: ["request-email"],
    mutationFn: async (email: string) => {
      const state = await requestEmail(slug, email);

      if (state.type === "error") throw new Error(state.error);

      return state;
    },

    onSuccess: (data) => {
      if (data.type !== "success") throw new Error("Invalid state");

      toast({
        title: "Success",
        description: "We'll send you an email soon!",
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    },
  });

  return <>
    <h2 className="font-normal mb-2">request an email</h2>

    <form className="flex flex-col gap-4" onSubmit={async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get("email") as string;

      await mutateAsync(email);
    }}>
      <Input
        type="email"
        name="email"
        placeholder="your@email.com"
        loading={isPending}
        action={{
          label: isPending ? "sending..." : "send",
        }}
        required
      />
    </form>
  </>;
}

export default withQueryClient(EmailRequest);
