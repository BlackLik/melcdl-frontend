// src/components/ui/RegistrationForm.tsx
import * as React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

// 1) Опишем Zod-схему (минимальная, для UI-валидации)
const registrationSchema = z
  .object({
    login: z.string().nonempty({ message: 'Login обязателен' }).min(6, { message: 'Логин минимум 6 символов' }),
    password: z.string().nonempty({ message: 'Пароль обязателен' }).min(6, { message: 'Пароль минимум 6 символов' }),
    passwordRepeated: z.string().nonempty({ message: 'Повтор пароля обязателен' }),
    isConfirm: z.boolean(),
  })
  .refine(data => data.password === data.passwordRepeated, {
    path: ['passwordRepeated'],
    message: 'Пароли не совпадают',
  })
  .refine(data => data.isConfirm, {
    path: ['isConfirm'],
    message: 'Нужно подтвердить согласие',
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const RegistrationForm: React.FC = () => {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      login: '',
      password: '',
      passwordRepeated: '',
      isConfirm: false,
    },
    mode: 'onBlur',
  });

  const { login, registration, error: storeError } = useAuthStore();

  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      await registration(data.login, data.password, data.passwordRepeated, data.isConfirm);
    } catch {
      setIsLoading(false);
      return;
    }

    try {
      await login(data.login, data.password);
      navigate('/');
    } catch {}

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Общая ошибка отправки */}
        {(submitError || storeError) && (
          <div className="text-center text-red-600 text-sm">{submitError ?? storeError}</div>
        )}

        {/* Поле login */}
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Введите логин" {...field} autoComplete="username" />
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
                <Input type="password" placeholder="Введите пароль" {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Поле password_repeated */}
        <FormField
          control={form.control}
          name="passwordRepeated"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Повторите пароль" {...field} autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Чекбокс is_confirm */}
        <FormField
          control={form.control}
          name="isConfirm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={val => field.onChange(val)} />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-base">Согласен с условиями</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Кнопка «Зарегистрироваться» */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          Зарегистрироваться
        </Button>

        {/* Ссылка на страницу входа */}
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </Form>
  );
};
