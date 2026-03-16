import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  bigserial,
  varchar,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  slug: varchar("slug", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  accentColor: varchar("accent_color", { length: 50 }),
  coverImageUrl: text("cover_image_url"),
  scaffolded: boolean("scaffolded").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 200 }).primaryKey(),
    categorySlug: varchar("category_slug", { length: 100 })
      .notNull()
      .references(() => categories.slug),
    rank: integer("rank").notNull().default(0),
    featured: boolean("featured").default(false),
    name: text("name").notNull(),
    description: text("description"),
    whyTopFind: text("why_top_find"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    rating: numeric("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count"),
    imageUrl: text("image_url"),
    affiliateUrl: text("affiliate_url").notNull(),
    youtubeVideoId: varchar("youtube_video_id", { length: 50 }),
    tags: text("tags").array(),
    asin: varchar("asin", { length: 20 }),
    lastRefreshedAt: timestamp("last_refreshed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("products_category_slug_idx").on(table.categorySlug)]
);

export const pageViews = pgTable(
  "page_views",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    entityType: varchar("entity_type", { length: 20 }).$type<EntityType>().notNull(),
    entityId: varchar("entity_id", { length: 200 }).notNull(),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
  },
  (table) => [
    index("page_views_entity_idx").on(table.entityType, table.entityId),
    index("page_views_viewed_at_idx").on(table.viewedAt),
  ]
);

export const affiliateClicks = pgTable(
  "affiliate_clicks",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    productId: varchar("product_id", { length: 200 })
      .notNull()
      .references(() => products.id),
    clickedAt: timestamp("clicked_at").defaultNow().notNull(),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
  },
  (table) => [
    index("affiliate_clicks_product_id_idx").on(table.productId),
    index("affiliate_clicks_clicked_at_idx").on(table.clickedAt),
  ]
);

/** Discriminates which entity a page_view row refers to. */
export type EntityType = "product" | "category";

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;
