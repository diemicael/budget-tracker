"use client"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants"
import { differenceInDays, startOfMonth } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"
import TransactionTable from "./_components/TransactionTable"

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date()
  })
  return (
    <>
      <div className="border-b bg-card">
        <div className="my-container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Histórico de transações</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range
              // we update the date range only if both dates are set

              if (!from || !to) return
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(`O intervalo de datas não pode ser maior que ${MAX_DATE_RANGE_DAYS} dias`)
                return
              }

              setDateRange({ from, to })
            }}
          />
        </div>
      </div>
      <div className="my-container">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  )
}
