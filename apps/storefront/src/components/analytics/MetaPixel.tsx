"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function MetaPixel({ pixelId }: { pixelId: string | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;

    // Initialize Facebook Pixel
    (function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    (window as any).fbq("init", pixelId);
    (window as any).fbq("track", "PageView");
  }, [pixelId]);

  // Track PageView on route change
  useEffect(() => {
    if (pixelId && (window as any).fbq) {
      (window as any).fbq("track", "PageView");
    }
  }, [pathname, searchParams, pixelId]);

  return null;
}

// Global Helper for Custom Events
export const trackMetaEvent = (event: string, data?: any) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event, data);
    console.log(`[Meta Event] ${event}`, data);
  }
};
