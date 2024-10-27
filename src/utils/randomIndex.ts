import { randomUUID } from 'crypto';

export function randomIndex(): string {
  return randomUUID();
}