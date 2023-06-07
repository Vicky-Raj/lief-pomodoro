import { createContext, useState, useRef, MutableRefObject } from "react";

interface IFilterContext {
    show:string,
    sort:string,
    order:string,
}

export const FilterContext = createContext<MutableRefObject<IFilterContext>>({
  current: { show: "All", sort:"Priority", order:"ASC"},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const filter = useRef<IFilterContext>({ show: "All", sort:"Priority", order:"ASC" });

  return (
    <FilterContext.Provider value={filter}>{children}</FilterContext.Provider>
  );
}
