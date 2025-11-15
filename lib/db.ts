// lib/db.ts
// Temporärer Platzhalter – aktuell nutzen wir Supabase als Hauptdatenbank.
// Prisma wird später sauber eingerichtet, bis dahin vermeiden wir den Import von '@prisma/client'.

// Typ-Alias als Dummy – so schlägt kein Import fehl
export type EmptyDbClient = never;

// Dummy-Export, falls irgendwo `prisma` importiert wird
export const prisma = undefined as unknown as EmptyDbClient;
