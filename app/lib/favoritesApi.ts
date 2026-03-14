import { auth } from '@/app/lib/firebaseSdk';
import { requestJson } from '@/app/lib/firebaseRest';
import { mapLegacyIdsToDatabaseKeys } from '@/app/lib/psychologistsApi';

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

function getUserFavoritesPath(uid: string): string {
  return `users/${uid}/favorites`;
}

function getUserFavoriteItemPath(uid: string, psychologistId: string): string {
  return `${getUserFavoritesPath(uid)}/${encodeFavoriteId(psychologistId)}`;
}

function isLegacyFavoriteId(id: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id);
}

async function getAuthToken(): Promise<string> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User is not authenticated');
  }

  return currentUser.getIdToken();
}

export async function getUserFavoriteIds(uid: string): Promise<string[]> {
  const authToken = await getAuthToken();
  const favorites = await requestJson<FavoritesMap | null>(
    getUserFavoritesPath(uid),
    { authToken }
  );

  if (!favorites) {
    return [];
  }

  const favoriteIds = Object.keys(favorites)
    .filter((favoriteId) => Boolean(favorites[favoriteId]))
    .map((favoriteId) => decodeFavoriteId(favoriteId));
  const normalizedIds = favoriteIds.some(isLegacyFavoriteId)
    ? await mapLegacyIdsToDatabaseKeys(favoriteIds)
    : favoriteIds;
  const hasChanges =
    normalizedIds.length !== favoriteIds.length ||
    normalizedIds.some((id, index) => id !== favoriteIds[index]);

  if (hasChanges) {
    const normalizedFavorites = Object.fromEntries(
      normalizedIds.map((id) => [encodeFavoriteId(id), true])
    );

    try {
      await requestJson<Record<string, boolean>>(
        getUserFavoritesPath(uid),
        normalizedIds.length
          ? {
              method: 'PUT',
              authToken,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(normalizedFavorites),
            }
          : {
              method: 'DELETE',
              authToken,
            }
      );
    } catch {
    }
  }

  return normalizedIds;
}

export async function addUserFavorite(
  uid: string,
  psychologistId: string
): Promise<void> {
  const authToken = await getAuthToken();

  await requestJson<true>(getUserFavoriteItemPath(uid, psychologistId), {
    method: 'PUT',
    authToken,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(true),
  });
}

export async function removeUserFavorite(
  uid: string,
  psychologistId: string
): Promise<void> {
  const authToken = await getAuthToken();

  await requestJson<null>(getUserFavoriteItemPath(uid, psychologistId), {
    method: 'DELETE',
    authToken,
  });
}
