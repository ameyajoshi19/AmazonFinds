"use client";

import { useEffect } from "react";
import type { EntityType } from "@/lib/schema";

interface PageViewTrackerProps {
  entityType: EntityType;
  entityId: string;
}

/**
 * Fires a non-blocking page view event on mount.
 * Renders nothing — drop anywhere inside a page component.
 */
export default function PageViewTracker({
  entityType,
  entityId,
}: PageViewTrackerProps) {
  useEffect(() => {
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId }),
      keepalive: true,
    }).catch(() => {});
  }, [entityType, entityId]);

  return null;
}
