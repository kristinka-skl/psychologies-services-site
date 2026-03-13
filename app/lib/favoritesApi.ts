import { get, ref, remove, set } from 'firebase/database';
import { db } from '@/app/lib/firebaseClient';

type FavoritesMap = Record<string, boolean>;

function encodeFavoriteId(psychologistId: string): string {
  return encodeURIComponent(psychologistId);
}

function decodeFavoriteId(encodedId: string): string {
  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
}

function getUserFavoritesRef(uid: string) {
  return ref(db, `users/${uid}/favorites`);
}

function getUserFavoriteItemRef(uid: string, psychologistId: string) {
  return ref(db, `users/${uid}/favorites/${encodeFavoriteId(psychologistId)}`);
}

export async function getUserFavoriteIds(uid: string): Promise<string[]> {
  const snapshot = await get(getUserFavoritesRef(uid));

  if (!snapshot.exists()) {
    return [];
  }

  const favorites = snapshot.val() as FavoritesMap;

  return Object.keys(favorites)
    .filter((favoriteId) => Boolean(favorites[favoriteId]))
    .map((favoriteId) => decodeFavoriteId(favoriteId));
}

export async function addUserFavorite(
  uid: string,
  psychologistId: string
): Promise<void> {
  await set(getUserFavoriteItemRef(uid, psychologistId), true);
}

export async function removeUserFavorite(
  uid: string,
  psychologistId: string
): Promise<void> {
  await remove(getUserFavoriteItemRef(uid, psychologistId));
}
