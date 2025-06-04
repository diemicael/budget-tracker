"use client"

import { Category } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ReactNode } from "react"
import { DeleteCategory } from "../_actions/categories"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { TransactionType } from "@/lib/types"

interface Props {
  trigger: ReactNode
  category: Category
}

export default function DeleteCategoryDialog({ category, trigger }: Props) {
  const categoryIdentifier = `${category.name}-${category.type}`
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Categoria excluída com sucesso!", {
        id: categoryIdentifier
      })

      await queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    },
    onError: () => {
      toast.error("Erro ao excluir categoria", {
        id: categoryIdentifier
      })
    }
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita. Isso excluirá permanentemente sua categoria.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            toast.loading("Excluindo a categoria...", {
              id: categoryIdentifier
            })
            deleteMutation.mutate({
              name: category.name,
              type: category.type as TransactionType
            })
          }}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
