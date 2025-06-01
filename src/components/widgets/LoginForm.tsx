// src/components/ui/LoginForm.tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Импорты из shadcn/ui
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

// 1) Определяем Zod-схему для валидации
const loginSchema = z.object({
  login: z.string().nonempty({ message: 'Login обязателен' }).min(6, { message: 'Логин минимум 6 символов' }),
  password: z.string().nonempty({ message: 'Пароль обязателен' }).min(6, { message: 'Пароль минимум 6 символов' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// 2) Компонент с React Hook Form + ZodResolver
export const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { login, isLoading, error: storeError } = useAuthStore();
  const navigate = useNavigate();

  const [localError, setLocalError] = React.useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setLocalError(null);
    try {
      await login(data.login, data.password);
      navigate('/');
      // После успешного логина, вы можете, например, перенаправить:
      // navigate('/dashboard');
    } catch (err: any) {
      // Ошибка уже установлена в Zustand (storeError), но мы хотим показать её в форме
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setLocalError(message);
    }
  };

  return (
    // 3) FormProvider из shadcn/ui
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {(storeError || localError) && (
          <div className="text-center text-red-600 text-sm">{localError ?? storeError}</div>
        )}
        {/* Поле email */}
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@mail.com" {...field} autoComplete="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Поле password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Кнопки */}
        <div className="flex flex-col gap-2">
          {/* 1) Кнопка «Войти» (submit) */}
          <Button type="submit" className="w-full">
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          {/* 2) Кнопка «Зарегистрироваться» с variant="outline" */}
          <Button asChild variant="outline" className="w-full">
            <Link to="/registration/">Зарегистрироваться</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
