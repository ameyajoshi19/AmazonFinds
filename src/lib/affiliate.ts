const AFFILIATE_TAG =
  process.env.NEXT_PUBLIC_AFFILIATE_TAG || "amazonfinds-20";

export function buildAffiliateUrl(url: string): string {
  return url.replace("AFFILIATE_TAG_PLACEHOLDER", AFFILIATE_TAG);
}

export function getAffiliateTag(): string {
  return AFFILIATE_TAG;
}
