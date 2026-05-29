"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ScrollReveal = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={classNames("scroll-reveal", visible && "scroll-reveal-visible", className)}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
