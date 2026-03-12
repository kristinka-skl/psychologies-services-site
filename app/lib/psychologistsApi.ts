import { get, ref } from 'firebase/database';
import { db } from '@/app/lib/firebaseClient';
import { Psychologist } from '@/app/types/psychologist';

type PsychologistWithoutId = Omit<Psychologist, 'id'>;
type PsychologistsMap = Record<string, PsychologistWithoutId>;

function createIdFromName(name: string, index: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `psychologist-${index + 1}`;
}

function normalizeArrayData(data: PsychologistWithoutId[]): Psychologist[] {
  return data.map((psychologist, index) => ({
    id: createIdFromName(psychologist.name, index),
    ...psychologist,
  }));
}

function normalizeMapData(data: PsychologistsMap): Psychologist[] {
  return Object.entries(data).map(([id, psychologist]) => ({
    id,
    ...psychologist,
  }));
}

export async function getPsychologists(): Promise<Psychologist[]> {
  const snapshot = await get(ref(db, 'psychologists'));

  if (!snapshot.exists()) {
    return [];
  }

  const value = snapshot.val() as PsychologistWithoutId[] | PsychologistsMap;

  if (Array.isArray(value)) {
    return normalizeArrayData(value);
  }

  return normalizeMapData(value);
}
