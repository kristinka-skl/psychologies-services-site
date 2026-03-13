import { requestJson } from '@/app/lib/firebaseRest';
import { Psychologist } from '@/app/types/psychologist';

type PsychologistWithoutId = Omit<Psychologist, 'id'>;
type PsychologistsMap = Record<string, PsychologistWithoutId>;
type PsychologistsResponse = PsychologistWithoutId[] | PsychologistsMap | null;

interface GetPsychologistsPageOptions {
  cursor?: string | null;
  limit?: number;
}

interface PsychologistsPage {
  items: Psychologist[];
  nextCursor: string | null;
  hasMore: boolean;
}

function createIdFromName(name: string, fallbackKey: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `psychologist-${fallbackKey}`;
}

function normalizeResponseEntries(
  value: PsychologistsResponse
): { entries: Array<[string, PsychologistWithoutId]>; isArray: boolean } {
  if (!value) {
    return { entries: [], isArray: false };
  }

  if (Array.isArray(value)) {
    return {
      entries: value
        .map(
          (psychologist, index): [string, PsychologistWithoutId | undefined] => [
            String(index),
            psychologist,
          ]
        )
        .filter(
          (entry): entry is [string, PsychologistWithoutId] => Boolean(entry[1])
        ),
      isArray: true,
    };
  }

  return { entries: Object.entries(value), isArray: false };
}

function normalizeEntriesData(
  entries: Array<[string, PsychologistWithoutId]>
): Psychologist[] {
  return entries.map(([key, psychologist]) => ({
    id: key,
    ...psychologist,
  }));
}

export async function getPsychologistsPage({
  cursor = null,
  limit = 3,
}: GetPsychologistsPageOptions = {}): Promise<PsychologistsPage> {
  const requestLimit = cursor ? limit + 2 : limit + 1;
  const value = await requestJson<PsychologistsResponse>('psychologists', {
    queryParams: {
      orderBy: '"$key"',
      limitToFirst: requestLimit,
      startAt: cursor ? JSON.stringify(cursor) : undefined,
    },
  });
  const { entries } = normalizeResponseEntries(value);
  const entriesWithoutCursor =
    cursor && entries[0]?.[0] === cursor ? entries.slice(1) : entries;
  const pageEntries = entriesWithoutCursor.slice(0, limit);
  const lastEntry = pageEntries.at(-1);

  return {
    items: normalizeEntriesData(pageEntries),
    nextCursor: lastEntry ? lastEntry[0] : null,
    hasMore: entriesWithoutCursor.length > limit,
  };
}

export async function getPsychologists(): Promise<Psychologist[]> {
  const allPsychologists: Psychologist[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const page = await getPsychologistsPage({ cursor, limit: 50 });
    allPsychologists.push(...page.items);
    cursor = page.nextCursor;
    hasMore = page.hasMore && Boolean(cursor);
  }

  return allPsychologists;
}

export async function getPsychologistsByIds(
  ids: string[]
): Promise<Psychologist[]> {
  if (!ids.length) {
    return [];
  }

  const requests = ids.map(async (id) => {
    const psychologist = await requestJson<PsychologistWithoutId | null>(
      `psychologists/${encodeURIComponent(id)}`
    );

    if (!psychologist) {
      return null;
    }

    return {
      id,
      ...psychologist,
    };
  });
  const psychologists = await Promise.all(requests);
  const psychologistById = new Map(
    psychologists
      .filter((item): item is Psychologist => Boolean(item))
      .map((item) => [item.id, item])
  );

  return ids
    .map((id) => psychologistById.get(id) ?? null)
    .filter((item): item is Psychologist => Boolean(item));
}

export async function mapLegacyIdsToDatabaseKeys(
  ids: string[]
): Promise<string[]> {
  if (!ids.length) {
    return [];
  }

  const allPsychologists = await getPsychologists();
  const keyByLegacyId = new Map<string, string>();
  const existingKeys = new Set<string>();

  allPsychologists.forEach((psychologist) => {
    existingKeys.add(psychologist.id);
    keyByLegacyId.set(
      createIdFromName(psychologist.name, psychologist.id),
      psychologist.id
    );
  });

  const normalizedIds = ids.map((id) => {
    if (existingKeys.has(id)) {
      return id;
    }

    return keyByLegacyId.get(id) ?? id;
  });

  return Array.from(new Set(normalizedIds));
}
