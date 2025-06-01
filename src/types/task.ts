// src/types/task.ts
export interface TaskDetailSchema {
  id: string;
  created_on: string;
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

export interface TaskDetail {
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

export interface UploadResponse {
  // структура, которую возвращает PUT /tasks/{id}/ (может совпадать с TaskDetailSchema)
  file: {
    id: string;
    created_on: string;
    updated_on: string;
    url: string;
    original_name: string;
  };
}
