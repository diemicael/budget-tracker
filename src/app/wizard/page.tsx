import { CurrencyComboBox, Logo } from "@/components"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function WizardPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="my-container flex max-w-2xl flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Bem vindo, <span className="ml-2 font-bold">{user.firstName} 👋</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Vamos começar configurando sua moeda
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          Você pode alterar essas configurações a qualquer momento
        </h3>
      </div>
      <Separator />
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Moeda</CardTitle>
          <CardDescription>Defina sua moeda padrão para transações</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>Pronto! Me leve ao dashboard</Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  )
}
