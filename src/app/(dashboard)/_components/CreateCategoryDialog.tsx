"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleOff, Loader2, PlusSquare } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CreateCategory } from "../_actions/categories"
import { useTheme } from "next-themes"

interface Props {
  type: TransactionType
  successCallback: (category: Category) => void
}

export default function CreateCategoryDialog({ type, successCallback }: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema as any),
    defaultValues: {
      type
    }
  })

  const queryClient = useQueryClient()
  const theme = useTheme()

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type
      })

      toast.success(`Categoria ${data.name} criada com sucesso! 🎉`, {
        id: "create-category",
      })

      successCallback(data)

      await queryClient.invalidateQueries({ queryKey: ["categories"] })

      setOpen((prev) => !prev)
    },
    onError: () => {
      toast.error("Erro ao criar categoria", {
        id: "create-category",
      })
    }
  })

  const onSubmit = useCallback((values: CreateCategorySchemaType) => {
    toast.loading("Criando categoria...", {
      id: "create-category",
    })
    mutate(values)
  }, [mutate])

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Criar nova categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar
            <span className={cn("m-1", type === "receita" ? "text-emerald-500" : "text-red-500")}>
              {type}
            </span>
          </DialogTitle>
          <DialogDescription>As categorias são usadas para agrupar suas transações</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Categoria" {...field} />
                  </FormControl>
                  <FormDescription>
                    É assim que sua categoria aparecerá no aplicativo.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">{field.value}</span>
                              <p className="text-xs text-muted-foreground">Clique para trocar</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px]! w-[48px]!" />
                              <p className="text-xs text-muted-foreground">Clique para selecionar</p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    É assim que sua categoria aparecerá no aplicativo.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => { form.reset() }}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Salvar"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
