/**
 * Amazon Product Advertising API 5.0 client.
 *
 * Implements AWS Signature Version 4 signing as required by PA API.
 * Credentials are loaded from environment variables:
 *   AMAZON_ACCESS_KEY_ID     — PA API Access Key
 *   AMAZON_SECRET_ACCESS_KEY — PA API Secret Key
 *   NEXT_PUBLIC_AFFILIATE_TAG — Associate tag (e.g. "amazonfinds-20")
 */

import crypto from "crypto";

const SERVICE = "ProductAdvertisingAPI";
const REGION = "us-east-1";
const HOST = "webservices.amazon.com";
const SEARCH_PATH = "/paapi5/searchitems";
const SEARCH_TARGET =
  "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";

// Maps site category slugs to Amazon SearchIndex values
export const CATEGORY_SEARCH_INDEX: Record<string, string> = {
  "arts-crafts": "ArtsAndCrafts",
  "back-to-school": "All",
  "bar-tools": "Kitchen",
  bathroom: "HomeAndKitchen",
  bedroom: "HomeAndKitchen",
  "books-reading": "Books",
  "cable-management": "Electronics",
  "camping-hiking": "SportingGoods",
  "candles-diffusers": "HomeAndKitchen",
  "charging-power": "Electronics",
  cleaning: "HomeAndKitchen",
  "coffee-tea": "Kitchen",
  "deals-of-the-day": "All",
  "desk-accessories": "OfficeProducts",
  "earbuds-headphones": "Electronics",
  fitness: "SportingGoods",
  "food-storage": "Kitchen",
  gaming: "VideoGames",
  "gifts-under-100": "All",
  "gifts-under-20": "All",
  "gifts-under-50": "All",
  "grilling-bbq": "Kitchen",
  "home-organization": "HomeAndKitchen",
  kitchen: "Kitchen",
  "kitchen-appliances": "Kitchen",
  "laptop-accessories": "Electronics",
  lighting: "HomeAndKitchen",
  "living-room": "HomeAndKitchen",
  music: "MusicalInstruments",
  office: "OfficeProducts",
  "outdoor-garden": "LawnAndGarden",
  "pantry-snacks": "GroceryAndGourmetFood",
  "patio-furniture": "Patio",
  "phone-accessories": "Electronics",
  photography: "Electronics",
  "plant-care": "LawnAndGarden",
  skincare: "BeautyAndPersonalCare",
  sleep: "HomeAndKitchen",
  "smart-home": "Electronics",
  "splurge-worthy": "All",
  stationery: "OfficeProducts",
  "storage-shelving": "HomeAndKitchen",
  "streaming-devices": "Electronics",
  "tech-gadgets": "Electronics",
  "vitamins-supplements": "HealthPersonalCare",
  woodworking: "HomeImprovement",
  "yoga-meditation": "SportingGoods",
};

export interface PAAPIProduct {
  asin: string;
  title: string;
  price: number | null;
  imageUrl: string;
  affiliateUrl: string;
}

function sha256(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSigningKey(secretKey: string, dateStamp: string): Buffer {
  const kDate = hmacSha256("AWS4" + secretKey, dateStamp);
  const kRegion = hmacSha256(kDate, REGION);
  const kService = hmacSha256(kRegion, SERVICE);
  return hmacSha256(kService, "aws4_request");
}

/**
 * Search Amazon for products matching `keywords` within `searchIndex`.
 * Returns up to `itemCount` results (max 10).
 *
 * Throws if credentials are missing or if the API returns an error.
 */
export async function searchAmazonProducts(
  keywords: string,
  searchIndex: string,
  itemCount: number = 1
): Promise<PAAPIProduct[]> {
  const accessKey = process.env.AMAZON_ACCESS_KEY_ID;
  const secretKey = process.env.AMAZON_SECRET_ACCESS_KEY;
  const partnerTag =
    process.env.NEXT_PUBLIC_AFFILIATE_TAG || "amazonfinds-20";

  if (!accessKey || !secretKey) {
    throw new Error(
      "Missing AMAZON_ACCESS_KEY_ID or AMAZON_SECRET_ACCESS_KEY environment variables. " +
        "Set these in .env.local or GitHub Secrets to enable product refresh."
    );
  }

  const now = new Date();
  // Format: 20240315T120000Z
  const amzDate =
    now.toISOString().replace(/[:\-]|\.\d{3}/g, "").substring(0, 15) + "Z";
  const dateStamp = amzDate.substring(0, 8);

  const payload = JSON.stringify({
    Keywords: keywords,
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
    SearchIndex: searchIndex,
    ItemCount: Math.min(itemCount, 10),
    SortBy: "Relevance",
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
  });

  const hashedPayload = sha256(payload);
  const contentType = "application/json; charset=UTF-8";

  const canonicalHeaders =
    [
      `content-encoding:amz-1.0`,
      `content-type:${contentType}`,
      `host:${HOST}`,
      `x-amz-date:${amzDate}`,
      `x-amz-target:${SEARCH_TARGET}`,
    ].join("\n") + "\n";

  const signedHeaders =
    "content-encoding;content-type;host;x-amz-date;x-amz-target";

  const canonicalRequest = [
    "POST",
    SEARCH_PATH,
    "",
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(secretKey, dateStamp);
  const signature = hmacSha256(signingKey, stringToSign).toString("hex");

  const authorizationHeader = [
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");

  const response = await fetch(`https://${HOST}${SEARCH_PATH}`, {
    method: "POST",
    headers: {
      "content-encoding": "amz-1.0",
      "content-type": contentType,
      host: HOST,
      "x-amz-date": amzDate,
      "x-amz-target": SEARCH_TARGET,
      Authorization: authorizationHeader,
    },
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PA API HTTP ${response.status}: ${errorText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await response.json()) as any;
  const items: unknown[] = data?.SearchResult?.Items ?? [];

  return items.map((item: unknown): PAAPIProduct => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i = item as any;
    const asin: string = i.ASIN ?? "";
    const title: string = i.ItemInfo?.Title?.DisplayValue ?? "";
    const price: number | null =
      i.Offers?.Listings?.[0]?.Price?.Amount ?? null;
    const imageUrl: string = i.Images?.Primary?.Large?.URL ?? "";
    // Use AFFILIATE_TAG_PLACEHOLDER so buildAffiliateUrl() can swap it at runtime
    const affiliateUrl = `https://www.amazon.com/dp/${asin}?tag=AFFILIATE_TAG_PLACEHOLDER`;

    return { asin, title, price, imageUrl, affiliateUrl };
  });
}
