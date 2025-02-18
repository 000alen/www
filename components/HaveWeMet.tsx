"use client";

import { useActionState, useEffect } from "react";
import { createIntro } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function HaveWeMet() {
  const router = useRouter();

  const [state, action] = useActionState(createIntro, {
    type: "idle",
  });

  useEffect(() => {
    if (state.type === "success") {
      router.push(`/intro/${state.slug}`);
    }
  }, [state.type, state, router]);

  return <>
    <h2 className="font-normal mb-2">have we met?</h2>
    <form className="mb-8 relative" action={action}>
      <input
        type="text"
        name="query"
        placeholder="Tell me a bit about yourself or where we might have crossed paths..."
        className="w-full bg-[#111111] border border-[#333333] text-[#909090] p-2 rounded-md text-xs focus:outline-none focus:border-[#555555] transition-colors"
      />

      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-xs bg-[#222222] text-[#909090] hover:bg-[#333333] transition-all duration-300">
        →
      </button>
    </form>
  </>;
}