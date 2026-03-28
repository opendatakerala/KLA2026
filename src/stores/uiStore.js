import { atom } from 'nanostores';

export const disclaimerDismissed = atom(false);
export const disclaimerOpen = atom(false);

export function openDisclaimer() {
  disclaimerOpen.set(true);
}

export function closeDisclaimer() {
  disclaimerOpen.set(false);
}