"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Loader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);


  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.target !== "_blank" &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.href.includes('#') && // Do not trigger for hash links
        anchor.href !== window.location.href
      ) {
         setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]);

  const loadingBarStyle = {
    transform: `scaleX(${loading ? 0.8 : 0})`,
    transition: `transform ${loading ? "10s" : "0.5s"} cubic-bezier(0.1, 0.9, 0, 1)`,
  };

  return <div id="loading-bar" style={loadingBarStyle}></div>;
}


export default function TopLoader() {
    return <Suspense><Loader /></Suspense>;
}
