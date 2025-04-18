import { z } from "zod";

export const ChapterSchema = z.object({
    title: z
    .string() // string type
    .min(1, {message: "Title is required"}) // checks if the string is not empty
    .max(255, {message: "Title is too long"}), // checks if the string is not too long
    // check if title contains special characters other than !?[],.:;-_(){}'" and spaces
    isPublic: z
    .boolean(), // boolean type
    content: z
    .string() // string type
    .max(100000, {message: "Description is too long"}), // checks if the string is not too long
})