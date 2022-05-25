import { go } from "fuzzysort";

import { Location } from "../../others/contexts/api";

const DEFAULT_SEARCH_OPTIONS = {
  limit: 30,
  threshold: -10000,
  key: "name",
};

export function fuzzySearch(needle: string, elements: Location[]): Fuzzysort.KeyResults<Location> {
  return go(needle, elements, DEFAULT_SEARCH_OPTIONS);
}
