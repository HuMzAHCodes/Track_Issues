import { z } from "zod";
import { Status } from "@prisma/client";

// Zod schema for validating the issue creation form
// This is the single source of truth — used for both API validation and form validation


export const issueschema = z.object({

  // Title must not be empty and cannot exceed 255 characters
  title: z.string().min(1, "Title is Required").max(255),
  // Description must not be empty
  description: z.string().min(1, "Description is Required").max(65535)

});


// we can't directly use issueschema for PATCH because it requires ALL fields
// if we only want to update assignedToUserId, we'd still be forced to send
// title and description — which is not how PATCH should work
// so we make a separate schema where every field is optional
// this way we can send just one field and Zod won't complain about the rest


export const PatchIssueSchema = z.object({

  title: z.string().min(1, "Title is Required").max(255).optional(),
  description: z.string().min(1, "Description is Required").max(65535).optional(),
  assignedToUserId: z.string().min(1, "AssignedToUserId is required").max(255).optional().nullable(),
  status: z.nativeEnum(Status).optional()

});


// ─────────────────────────────────────────────────────────────────────────────
// ZOD — WHAT IT IS
// ─────────────────────────────────────────────────────────────────────────────
// Zod is a TypeScript-first schema validation library
// you define the shape and rules of your data once
// Zod then validates incoming data against those rules at runtime
// it also auto-generates TypeScript types from your schema — no duplication needed
//
// used in two places in this project:
// 1. API routes — validate request body before touching the database
// 2. Forms — validate user input before submitting via react-hook-form + zodResolver
//
// ─────────────────────────────────────────────────────────────────────────────
// ZOD — AVAILABLE VALIDATORS (with examples)
// ─────────────────────────────────────────────────────────────────────────────
//
// STRING VALIDATORS:
// z.string()                          → must be a string
// z.string().min(1)                   → minimum 1 character (prevents empty strings)
// z.string().min(1, "custom message") → same but with a custom error message
// z.string().max(255)                 → maximum 255 characters
// z.string().max(65535, "too long")   → same but with a custom error message
// z.string().email()                  → must be a valid email format
// z.string().url()                    → must be a valid URL
// z.string().uuid()                   → must be a valid UUID
// z.string().regex(/^\d+$/)           → must match a custom regex pattern
// z.string().length(10)               → must be exactly 10 characters
// z.string().startsWith("https")      → must start with "https"
// z.string().endsWith(".com")         → must end with ".com"
// z.string().trim()                   → trims whitespace before validation
// z.string().toLowerCase()            → converts to lowercase before validation
// z.string().toUpperCase()            → converts to uppercase before validation
//
// NUMBER VALIDATORS:
// z.number()                          → must be a number
// z.number().min(0)                   → minimum value of 0
// z.number().max(100)                 → maximum value of 100
// z.number().int()                    → must be an integer (no decimals)
// z.number().positive()               → must be greater than 0
// z.number().negative()               → must be less than 0
// z.number().nonnegative()            → must be 0 or greater
//
// BOOLEAN VALIDATORS:
// z.boolean()                         → must be true or false
// z.literal(true)                     → must be exactly true
//
// DATE VALIDATORS:
// z.date()                            → must be a Date object
// z.date().min(new Date("2020-01-01"))→ must be after this date
// z.date().max(new Date())            → must be before current date
//
// MODIFIERS (chain onto any validator):
// .optional()     → field can be undefined (not required) ← used in PatchIssueSchema
// .nullable()     → field can be null ← used in PatchIssueSchema for assignedToUserId
//                   (null = intentionally unassign a user)
// .optional().nullable() → field can be EITHER undefined OR null ← used together here
// .default("OPEN")       → use this value if field is not provided
// .array()               → must be an array of this type e.g. z.string().array()
//
// OBJECT VALIDATORS:
// z.object({...})                     → validates an object shape ← used here
// z.object({...}).partial()           → makes ALL fields optional at once
//                                       (alternative to adding .optional() to each field)
//
// PARSING METHODS:
// schema.parse(data)         → validates data, THROWS an error if invalid
// schema.safeParse(data)     → validates data, RETURNS { success, error } — never throws
//                              ← used in API routes because we handle errors manually
//
// TYPE INFERENCE:
// type IssueForm = z.infer<typeof issueschema>
//   → auto-generates a TypeScript type from the schema
//   → no need to manually define interfaces that duplicate the schema
//   ← used in IssueForm.tsx with react-hook-form
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY TWO SEPARATE SCHEMAS?
// ─────────────────────────────────────────────────────────────────────────────
// issueschema    → used for POST (creating) — ALL fields required
// PatchIssueSchema → used for PATCH (updating) — ALL fields optional
//
// this is the correct REST API design:
// POST  /api/issues       → create, must send title + description
// PATCH /api/issues/[id]  → update, can send any combination of fields
// ─────────────────────────────────────────────────────────────────────────────