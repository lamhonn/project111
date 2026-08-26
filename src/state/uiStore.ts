import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const languageAtom = atomWithStorage<string>("systemLanguage", "en");

export const tabletNumberAtom = atom<number>(0);

export const restaurantNameAtom = atom<string>('Restaurant');

export const waiterRequestedAtom = atom<boolean>(false);

// TODO: create a websocket logic
export const lockedAtom = atom<boolean>(false);