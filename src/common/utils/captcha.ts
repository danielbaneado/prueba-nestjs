import { Inject, Injectable, Optional } from '@nestjs/common';
import crypto from 'crypto';

/**
 * Lo que recibe el cliente. La respuesta NO viaja: solo vive en `captchaStore`.
 * Si se devolviera, cualquier bot la leeria y el captcha no protegeria nada.
 */
export interface CaptchaChallenge {
  token: string;
  question: string;
}

export interface CaptchaStore {
  get(token: string): { answer: number; expiresAt: number } | undefined;
  set(token: string, data: { answer: number; expiresAt: number }): void;
  delete(token: string): void;
  entries(): IterableIterator<[string, { answer: number; expiresAt: number }]>;
}

/** Token de inyección para personalizar el store de captchas (ej. Redis). */
export const CAPTCHA_STORE = 'CAPTCHA_STORE';

/** Store en memoria por defecto. Solo válido para una sola instancia del proceso
 * (no escala a cluster/serverless); para producción inyectá un store externo. */
export class InMemoryCaptchaStore implements CaptchaStore {
  private readonly map = new Map<string, { answer: number; expiresAt: number }>();

  get(token: string): { answer: number; expiresAt: number } | undefined {
    return this.map.get(token);
  }
  set(token: string, data: { answer: number; expiresAt: number }): void {
    this.map.set(token, data);
  }
  delete(token: string): void {
    this.map.delete(token);
  }
  entries(): IterableIterator<[string, { answer: number; expiresAt: number }]> {
    return this.map.entries();
  }
}

const DEFAULT_EXPIRES_MS = 5 * 60 * 1000; // 5 minutos

@Injectable()
export class Captcha {
  private readonly store: CaptchaStore;

  constructor(
    @Optional()
    @Inject(CAPTCHA_STORE)
    store?: CaptchaStore,
  ) {
    // Si no se provee un store externo (Redis, etc.), usamos el de memoria.
    this.store = store ?? new InMemoryCaptchaStore();
  }

  generateCaptcha(expiresInMs: number = DEFAULT_EXPIRES_MS): CaptchaChallenge {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer: number;
    let question: string;

    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `¿Cuánto es ${num1} + ${num2}?`;
        break;
      case '-':
        answer = num1 - num2;
        question = `¿Cuánto es ${num1} - ${num2}?`;
        break;
      case '*':
        answer = num1 * num2;
        question = `¿Cuánto es ${num1} × ${num2}?`;
        break;
      default:
        answer = num1 + num2;
        question = `¿Cuánto es ${num1} + ${num2}?`;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + expiresInMs;

    this.store.set(token, { answer, expiresAt });

    return { token, question };
  }

  /**
   * Verifica un captcha. Devuelve `false` si:
   * - el token no existe (nunca fue generado o ya fue usado)
   * - el token está expirado
   * - la respuesta no coincide
   *
   * Es de uso único: el token se elimina al verificar (correcto o incorrecto).
   */
  verifyCaptcha(token: string, userAnswer: number): boolean {
    const stored = this.store.get(token);
    if (!stored) return false;

    // Eliminar el captcha después de verificar (uso único).
    this.store.delete(token);

    // Verificar expiración después de borrar: si está expirado, ya no sirve.
    if (Date.now() > stored.expiresAt) return false;

    return stored.answer === userAnswer;
  }

  /** Limpia los captchas expirados. Llamar periódicamente (ej. cada minuto). */
  cleanExpiredCaptchas(): void {
    const now = Date.now();
    for (const [token, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(token);
      }
    }
  }
}