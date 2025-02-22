import { pgTable, serial, text, jsonb, vector, timestamp, index, integer } from "drizzle-orm/pg-core"
import { user } from "@/db/auth-schema"

export const intros = pgTable("intros", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),

  slug: text("slug").notNull(),

  query: text("query").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),

  intro: jsonb("intro").notNull(),
}, (t) => ([
  index("embeddingIndex").using("hnsw", t.embedding.op("vector_cosine_ops")),
]));

export type Intro = typeof intros.$inferSelect;
export type NewIntro = typeof intros.$inferInsert;

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    userId: text("user_id").notNull().references(() => user.id),
    parentId: integer("parent_id"),
    content: text("content").notNull(),
  }
);

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
