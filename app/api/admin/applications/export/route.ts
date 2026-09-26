import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { submissionsToCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { isApplicationType } from "@/lib/applications/validation";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in to export applications." } }, { status: 401 });
  const requested = new URL(request.url).searchParams.get("type");
  if (requested && !isApplicationType(requested)) return NextResponse.json({ error: { code: "INVALID_TYPE", message: "Unknown application type." } }, { status: 422 });
  const rows = await prisma.applicationSubmission.findMany({
    where: requested ? { applicationType: requested } : undefined,
    orderBy: { createdAt: "desc" },
    take: 10_000,
  });
  return new NextResponse(submissionsToCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="munair-applications${requested ? `-${requested}` : ""}.csv"`,
      "cache-control": "no-store",
    },
  });
}
