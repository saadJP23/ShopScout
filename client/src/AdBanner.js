import { useEffect, useState, useRef } from "react";

const AdBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // Set a timeout to simulate loading (or use IntersectionObserver for advanced behavior)
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000); // Adjust timing if needed
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div style={{ display: isLoaded ? "block" : "none", textAlign: "center", margin: "1rem 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", height: "90px" }}  // You can adjust height here
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
