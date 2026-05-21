import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {

  // prisma.user.findMany() fetches all users from the database
  // orderBy sorts the results alphabetically by name (asc = A to Z)
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });

  // wrap the users array in a JSON response and send it back to the client
  return NextResponse.json(users);

}


// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS FILE DOES
// ─────────────────────────────────────────────────────────────────────────────
// This is the API endpoint at GET /api/users
// It runs on the SERVER — Prisma has full access to the database here
//
// When AssigneeSelect calls axios.get("/api/users"):
//   1. This GET handler runs on the server
//   2. Prisma queries the database for all users
//   3. Returns them as a JSON array to the client
//   4. AssigneeSelect receives the array and populates the dropdown
//
// ─────────────────────────────────────────────────────────────────────────────
// PRISMA — AVAILABLE METHODS ON prisma.user
// ─────────────────────────────────────────────────────────────────────────────
//
// READ:
// prisma.user.findMany()                          → fetch all users
// prisma.user.findMany({ where: {role:"ADMIN"} }) → fetch with filter
// prisma.user.findMany({ orderBy: {name:"asc"} }) → fetch sorted  ← used here
// prisma.user.findMany({ take: 10, skip: 20 })    → fetch with pagination
// prisma.user.findUnique({ where: { id: "1" } })  → fetch one by unique field
// prisma.user.findFirst({ where: { name: "x" } }) → fetch first match
//
// CREATE:
// prisma.user.create({ data: { name, email } })   → insert one user
// prisma.user.createMany({ data: [...] })          → insert multiple users
//
// UPDATE:
// prisma.user.update({ where:{id}, data:{name} }) → update one user
// prisma.user.updateMany({ where, data })          → update multiple users
// prisma.user.upsert({ where, update, create })    → update if exists, create if not
//
// DELETE:
// prisma.user.delete({ where: { id: "1" } })      → delete one user
// prisma.user.deleteMany({ where: { role:"x" } }) → delete multiple users
//
// AGGREGATE:
// prisma.user.count()                             → count all users
// prisma.user.count({ where: { role:"ADMIN" } })  → count with filter
// prisma.user.aggregate({ _avg: { age: true } })  → avg, sum, min, max on fields
// prisma.user.groupBy({ by: ["role"] })           → group results by a field
//
// ─────────────────────────────────────────────────────────────────────────────
// orderBy OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
// orderBy: { name: 'asc' }        → A to Z  ← used here
// orderBy: { name: 'desc' }       → Z to A
// orderBy: { createdAt: 'desc' }  → newest first
// orderBy: { createdAt: 'asc' }   → oldest first
// orderBy: [{ role: 'asc' }, { name: 'asc' }]  → sort by multiple fields
// ─────────────────────────────────────────────────────────────────────────────