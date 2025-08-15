"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

function Loader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We need to use a mutation observer because the Next.js router
    // updates the document title after the route change is complete.
    // We can use this to determine when to stop the progress bar.
    const observer = new MutationObserver(() => {
        if (document.title) {
            handleStop();
        }
    });

    // Start the progress bar on initial load.
    handleStart();

    observer.observe(document.querySelector('title')!, {
        childList: true,
    });
    
    // Stop the progress bar on initial load.
    handleStop();
    
    return () => {
        observer.disconnect();
    };

  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function TopLoader() {
  return (
    <Suspense>
      <Loader />
    </Suspense>
  );
}