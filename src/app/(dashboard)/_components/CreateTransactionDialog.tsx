"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TransactionType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

interface Props {
  trigger: React.ReactNode
  type: TransactionType
}

export default function CreateTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar uma nova transação de<span className={cn("m-1", type === "receita" ? "text-emerald-500" : "text-red-500")}>{type}</span>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
