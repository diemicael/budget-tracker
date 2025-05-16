import { Logo } from "@/components"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  )
}
