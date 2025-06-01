import type { TaskDetailSchema, TaskDetail } from '@/types/task';

export const transformTaskDetail = (data: TaskDetailSchema): TaskDetail => ({
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
