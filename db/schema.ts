import { pgTable, serial, text, jsonb, vector, timestamp, index } from "drizzle-orm/pg-core"

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
