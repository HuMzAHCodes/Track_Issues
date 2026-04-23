import { z } from "zod";

// Zod schema for validating the issue creation form
// This is the single source of truth — used for both API validation and form validation
export const issueschema = z.object({

    // Title must not be empty and cannot exceed 255 characters
    title: z.string().min(1, "Title is Required").max(255),

    // Description must not be empty
    description: z.string().min(1, "Description is Required")

});