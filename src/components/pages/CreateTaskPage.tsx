// src/pages/UploadPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Wrapper from '@/components/layout/Wrapper';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

// React Hook Form
import { useForm } from 'react-hook-form';
import axios from 'axios';
import config from '@/config';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import type { TaskDetailSchema } from '@/types/task';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Типы
interface UploadFormValues {
  file: FileList | null;
}

interface Model {
  id: string;
  name: string;
}

export const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);

  const [modelID, setModelID] = useState<string>('');

  const { accessToken } = useAuthStore();

  const form = useForm<UploadFormValues>({
    defaultValues: {
      file: null,
    },
  });

  const getModels = async () => {
    const response = await axios.get<Model[]>(`${config.VITE_API_URL}/api/v1/ml/models/`);
    setModels(response.data);
  };

  const onSubmit = async (data: UploadFormValues) => {
    setUploadError(null);

    if (!accessToken) {
      navigate(0);
      return;
    }

    if (!data.file || data.file.length === 0) {
      setUploadError('Выберите файл для загрузки.');
      return;
    }

    const fileToUpload = data.file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload);

    setIsUploading(true);
    try {
      const response = await axios.put<TaskDetailSchema>(
        `${config.VITE_API_URL}/api/v1/ml/tasks/${modelID}/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` },
        },
      );
      // После успешной загрузки переходим к деталям задачи
      navigate(`/${response.data.id}/`);
    } catch (err: any) {
      console.error('Ошибка при загрузке файла:', err);
      const message = err.response?.data?.detail || err.response?.data?.error || 'Не удалось загрузить файл.';
      setUploadError(String(message));
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    getModels()
      .then()
      .catch(err => setUploadError(String(err)));
  }, []);

  const handleChangeModel = (val: string) => {
    setModelID(val);
  };

  return (
    <Wrapper>
      <div className="p-6 md:col-start-2">
        <Card className="max-w-md mx-auto space-y-4">
          <CardHeader>
            <CardTitle>Загрузить фото для задачи</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-ce">Выбрать модель</span>
              <Select value={modelID} onValueChange={val => handleChangeModel(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выбрать" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(opt => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {uploadError && <div className="text-center text-red-600">{uploadError}</div>}

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фото</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*;capture=camera"
                          onChange={e => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← Назад
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Wrapper>
  );
};

export default CreateTaskPage;
