"use client";
import { ReactNode, useEffect, useState } from "react";

const HydrationZustand = ({
  children,
  LoaderComponent,
}: {
  children: ReactNode;
  LoaderComponent: ReactNode;
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return <>{isHydrated ? children : LoaderComponent}</>;
};

export default HydrationZustand;
