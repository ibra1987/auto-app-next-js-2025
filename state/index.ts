import { AutoecoleSchema, AutoecoleType } from "@/types";
import { create, createStore } from "zustand";

type AutoState = {
    auto:AutoecoleType,
    setAuto:(a:AutoecoleType)=>void
}

const initialState :AutoState= {
    auto:"Akka",
      setAuto: () => {}, // Temporary no-op function


  
}
export const useAutoStore = create<AutoState>((set) => ({
  ...initialState, // Spread the initial state
  setAuto: (a) => set({ auto: a }), // Define the setAuto action
}));
