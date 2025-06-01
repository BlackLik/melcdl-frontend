import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_API_URL: z.string(),
});

const rawConfig = {
  NODE_ENV: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
};

const parsedConfig = ConfigSchema.safeParse(rawConfig);

if (!parsedConfig.success) {
  console.error('❌ Ошибка валидации переменных окружения:');
  console.error(parsedConfig.error.format());
  throw new Error('Конфигурация окружения (env) некорректна. Проверьте console.');
}

const config = parsedConfig.data;

export type Config = typeof config;
export default config;
