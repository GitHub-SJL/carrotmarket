import { useCallback, useEffect, useState } from "react";

export const useObserver = (
  onIntersect: any,
  threshold = 1.0,
  root = null,
  rootMargin = "0px"
) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const checkIntersect: IntersectionObserverCallback = useCallback(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        onIntersect(entry, observer);
      }
    },
    []
  );

  useEffect(() => {
    let observer: any;

    if (ref) {
      observer = new IntersectionObserver(checkIntersect, {
        root,
        rootMargin,
        threshold,
      });
      observer.observe(ref);
    }

    return () => observer && observer.disconnect();
  }, [ref, rootMargin, threshold, checkIntersect]);

  return setRef;
};
