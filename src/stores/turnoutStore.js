import { createTurnoutFetcherStore, createOverallTurnoutFetcherStore } from "./fetcher.js";
import { selectedConstituency } from "./constituencyStore.js";

export const turnoutStore = createTurnoutFetcherStore([selectedConstituency]);
export const overallTurnoutStore = createOverallTurnoutFetcherStore([]);
