"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTransaction } from "../_actions/deleteTransaction";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string
}

export default function DeleteTransactionDialog({open, setOpen, transactionId}: Props) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("Transação excluída com sucesso!", {
        id: transactionId
      })

      await queryClient.invalidateQueries({
        queryKey: ["transactions"]
      })
    },
    onError: () => {
      toast.error("Erro ao excluir categoria", {
        id: transactionId
      })
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>Esta ação não pode ser desfeita. Isso excluirá permanentemente sua transação.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            toast.loading("Excluindo a categoria...", {
              id: transactionId
            })
            deleteMutation.mutate(transactionId)
          }}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
