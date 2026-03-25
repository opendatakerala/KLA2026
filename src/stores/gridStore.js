import { atom } from 'nanostores';

export const filterStore = atom('all');
export const districtStore = atom('all');
export const searchStore = atom('');
export const modalStore = atom(null);

export function setFilter(filter) {
  filterStore.set(filter);
}

export function setDistrict(district) {
  districtStore.set(district);
}

export function setSearch(query) {
  searchStore.set(query);
}

export function openModal(constituency) {
  modalStore.set(constituency);
}

export function closeModal() {
  modalStore.set(null);
}
