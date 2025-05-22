"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import CategoryPicker from "./CategoryPicker"
import { useCallback } from "react"

interface Props {
  trigger: React.ReactNode
  type: TransactionType
}

export default function CreateTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema as any),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback((value: string) => {
    form.setValue("category", value);
  }, [form]);

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar uma nova transação de<span className={cn("m-1", type === "receita" ? "text-emerald-500" : "text-red-500")}>{type}</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição da transação (opcional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Valor da transação
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} onChange={handleCategoryChange} />
                    </FormControl>
                    <FormDescription>
                      Selecione uma categoria para essa transação
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
