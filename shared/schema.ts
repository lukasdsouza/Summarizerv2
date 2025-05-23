import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Book summaries table
export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  bookName: text("book_name").notNull(),
  imageUrl: text("image_url").notNull(),
  statusProcessing: boolean("status_processing").notNull().default(false),
  generatedSummary: text("generated_summary"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Schema for inserting a new summary
export const insertSummarySchema = createInsertSchema(summaries).omit({
  id: true,
  generatedSummary: true,
  createdAt: true
});

// Schema for updating a summary
export const updateSummarySchema = createInsertSchema(summaries).pick({
  statusProcessing: true,
  generatedSummary: true
});

export type InsertSummary = z.infer<typeof insertSummarySchema>;
export type UpdateSummary = z.infer<typeof updateSummarySchema>;
export type Summary = typeof summaries.$inferSelect;

// Valid MIME types for book cover images
export const validImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];
