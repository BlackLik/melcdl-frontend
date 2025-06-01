// src/pages/TaskPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Wrapper from '@/components/layout/Wrapper';

// Компоненты из shadcn/ui (предполагаются, что они у вас сгенерированы)
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/loader/Loader';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import config from '@/config';

// 1) Описываем тип, который приходит с бэкенда (snake_case)
interface TaskDetailSchema {
  id: string;
  created_on: string; // ISO-строка
  updated_on: string;
  status: string;
  message: string;
  file: {
    id: string;
    created_on: string;
    updated_on: string;
    url: string;
    original_name: string;
  } | null;
  predict: {
    id: string;
    result: string;
    probability: number;
  } | null;
}

// 2) Локальный тип с camelCase и Date
interface TaskDetail {
  id: string;
  createdOn: Date;
  updatedOn: Date;
  status: string;
  message: string;
  file: {
    id: string;
    createdOn: Date;
    updatedOn: Date;
    url: string;
    originalName: string;
  } | null;
  predict: {
    id: string;
    result: string;
    probability: number;
  } | null;
}

// 3) Трансформер: snake_case → camelCase + new Date(...)
const transformTaskDetail = (data: TaskDetailSchema): TaskDetail => ({
  id: data.id,
  createdOn: new Date(data.created_on),
  updatedOn: new Date(data.updated_on),
  status: data.status,
  message: data.message,
  file: data.file
    ? {
        id: data.file.id,
        createdOn: new Date(data.file.created_on),
        updatedOn: new Date(data.file.updated_on),
        url: data.file.url,
        originalName: data.file.original_name,
      }
    : null,
  predict: data.predict
    ? {
        id: data.predict.id,
        result: data.predict.result,
        probability: data.predict.probability,
      }
    : null,
});

export const TaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { accessToken } = useAuthStore();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 4) Функция загрузки данных по ID
  const fetchTask = async (token: string, taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<TaskDetailSchema>(`${config.VITE_API_URL}/api/v1/ml/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transformed = transformTaskDetail(response.data);
      setTask(transformed);
    } catch (err: any) {
      console.error('Ошибка при загрузке задачи:', err);
      setError('Не удалось загрузить задачу. Возможно, она не найдена.');
      setTask(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      // Если ID из URL отсутствует, возвращаем на главную
      navigate('/');
      return;
    }
    if (!accessToken) {
      navigate(0);
      return;
    }
    fetchTask(accessToken, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);

  return (
    <Wrapper>
      <div className="p-6 md:col-start-2">
        {isLoading ? (
          <div className="flex justify-center">
            {/* Spinner из shadcn/ui, если установлен */}
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : task ? (
          <Card className="max-w-3xl mx-auto space-y-6">
            {/* Заголовок с ID и статусом */}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Задача #{task.id}</span>
                <Badge variant="default">{task.status}</Badge>
              </CardTitle>
            </CardHeader>

            {/* Основное содержимое */}
            <CardContent className="space-y-4">
              {/* Информация о создании/обновлении */}
              <div className="flex space-x-6">
                <div>
                  <Label>Создана:</Label>
                  <p>{task.createdOn.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Обновлена:</Label>
                  <p>{task.updatedOn.toLocaleString()}</p>
                </div>
              </div>

              {/* Сообщение */}
              {task.message && (
                <div>
                  <Label>Сообщение:</Label>
                  <p>{task.message}</p>
                </div>
              )}

              <Separator />

              {/* Блок File, если есть */}
              {task.file ? (
                <div className="space-y-2">
                  <Label>Файл</Label>
                  <div className="flex flex-col space-y-1">
                    <p>ID: {task.file.id}</p>
                    <p>Создан: {task.file.createdOn.toLocaleString()}</p>
                    <p>Обновлён: {task.file.updatedOn.toLocaleString()}</p>
                    <Button asChild variant="link" className="p-0">
                      <a href={task.file.url} target="_blank" rel="noopener noreferrer">
                        Скачать («{task.file.originalName}»)
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Файл:</Label>
                  <p>Нет</p>
                </div>
              )}

              <Separator />

              {/* Блок Predict, если есть */}
              {task.predict ? (
                <div className="space-y-2">
                  <Label>Предсказание</Label>
                  <div className="flex flex-col space-y-1">
                    <p>ID предсказания: {task.predict.id}</p>
                    <p>Результат: {task.predict.result}</p>
                    <p>Вероятность: {(task.predict.probability * 100).toFixed(2)}%</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Предсказание:</Label>
                  <p>Нет</p>
                </div>
              )}
            </CardContent>

            {/* Footer с кнопкой «Назад» */}
            <CardFooter>
              <Button onClick={() => navigate(-1)}>← Назад</Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </Wrapper>
  );
};

export default TaskPage;
