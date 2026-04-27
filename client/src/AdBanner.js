import { useEffect, useRef } from "react";

const AdBanner = () => {
  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  const adRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const adEl = adRef.current;
    if (!adEl || initializedRef.current) return;

    const pushAd = () => {
      // Avoid duplicate initialization in React StrictMode / re-renders.
      if (initializedRef.current) return;

      const width = adEl.getBoundingClientRect().width;
      if (width <= 0) return;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initializedRef.current = true;
      } catch (e) {
        console.error("AdSense error", e);
      }
    };

    const observer = new ResizeObserver(() => {
      pushAd();
    });

    observer.observe(adEl);
    pushAd();

    return () => observer.disconnect();
  }, []);

  // Hide ad slots during local development to avoid layout/AdSense script noise.
  if (isLocalHost) return null;

  return (
    <div style={{ textAlign: "center", margin: "1rem 0", minHeight: "90px" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", height: "90px" }}
        data-ad-client="ca-pub-2013433811287400"
        data-ad-slot="9421866899"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
};

export default AdBanner;
