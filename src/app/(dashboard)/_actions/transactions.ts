"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser()
  if (!user) redirect("/sign-in");

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    }
  })
  if (!categoryRow) throw new Error("Categoria não encontrada");

  await prisma.$transaction([
    // create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      }
    }),

    // update month aggregates table
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear()
        }
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "despesa" ? amount : 0,
        income: type === "receita" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "despesa" ? amount : 0
        },
        income: {
          increment: type === "receita" ? amount : 0
        }
      }
    }),

    // update year aggregate table
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear()
        }
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "despesa" ? amount : 0,
        income: type === "receita" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "despesa" ? amount : 0
        },
        income: {
          increment: type === "receita" ? amount : 0
        }
      }
    })
  ])
}