export default function Layout({ children }: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="max-w-2xl w-full text-sm prose dark:prose-invert">
    {children}
  </div>
}