import { summaries, type Summary, type InsertSummary, type UpdateSummary } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getSummary(id: number): Promise<Summary | undefined>;
  createSummary(summary: InsertSummary): Promise<Summary>;
  updateSummary(id: number, summary: UpdateSummary): Promise<Summary | undefined>;
  getAllSummaries(): Promise<Summary[]>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  async getSummary(id: number): Promise<Summary | undefined> {
    const [summary] = await db.select().from(summaries).where(eq(summaries.id, id));
    return summary;
  }

  async createSummary(summaryData: InsertSummary): Promise<Summary> {
    const [summary] = await db
      .insert(summaries)
      .values({
        ...summaryData,
        statusProcessing: true,
        generatedSummary: null,
        createdAt: new Date().toISOString()
      })
      .returning();
    
    return summary;
  }

  async updateSummary(id: number, summaryData: UpdateSummary): Promise<Summary | undefined> {
    const [updatedSummary] = await db
      .update(summaries)
      .set(summaryData)
      .where(eq(summaries.id, id))
      .returning();
    
    return updatedSummary;
  }

  async getAllSummaries(): Promise<Summary[]> {
    return await db.select().from(summaries);
  }
}

// Create and export a storage instance
export const storage = new DatabaseStorage();
