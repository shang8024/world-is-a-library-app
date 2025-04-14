import { z } from "zod";

export const BookSchema = z.object({
    title: z
    .string() // string type
    .min(1, {message: "Title is required"}) // checks if the string is not empty
    .max(255, {message: "Title is too long"}), // checks if the string is not too long
    // check if title contains special characters other than !?[],.:;-_(){}'" and spaces
    isdraft: z
    .boolean()
    .default(false), // default value is false
    description: z
    .string() // string type
    .max(1000, {message: "Description is too long"}), // checks if the string is not too long
})