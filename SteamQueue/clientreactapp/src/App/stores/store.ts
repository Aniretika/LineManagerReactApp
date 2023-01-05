import { createContext, useContext } from "react";
import LineStore from "./lineStore";

interface Store {
    lineStore: LineStore;
}

export const store: Store ={
    lineStore: new LineStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}