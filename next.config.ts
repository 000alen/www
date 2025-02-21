import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // @ts-ignore
      ["remark-gfm"],
      // @ts-ignore
      // ["remark-math"],
    ],
    rehypePlugins: [
      // @ts-ignore
      ["rehype-katex"],
    ],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  /* config options here */
};

export default withMDX(nextConfig);
