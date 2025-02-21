import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-gfm"],
      // ["remark-math"],
    ],
    rehypePlugins: [["rehype-katex"]],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  /* config options here */
};

export default withMDX(nextConfig);
