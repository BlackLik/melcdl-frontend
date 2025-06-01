import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import config from '@/config';

interface Props {
  currentPage: number;
  batchSize: number;
}

interface TaskSchema {
  id: string;
  createdOn: Date;
  updatedOn: Date;
  status: string;
  message: string | null;
}

interface TaskItemSchema {
  id: string;
  created_on: string;
  updated_on: string;
  status: string;
  message: string | null;
}

interface BasePaginatorSnakeSchema<T> {
  data: T[];
  total_count: number;
  total_pages: number;
  batch_size: number;
  current_page: number;
}

interface BasePaginatorSchema<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  batchSize: number;
  currentPage: number;
}

const convert = (data: BasePaginatorSnakeSchema<TaskItemSchema>): BasePaginatorSchema<TaskSchema> => {
  const newData: BasePaginatorSchema<TaskSchema> = {
    data: [],
    totalCount: data.total_count,
    totalPages: data.total_pages,
    batchSize: data.batch_size,
    currentPage: data.current_page,
  };

  for (let elem of data.data) {
    newData.data.push({
      id: elem.id,
      createdOn: new Date(elem.created_on),
      updatedOn: new Date(elem.updated_on),
      status: elem.status,
      message: elem.message,
    });
  }

  return newData;
};

const fetchData = async (
  token: string,
  currentPage: number,
  batchSize: number,
): Promise<BasePaginatorSchema<TaskSchema>> => {
  const response = await axios.get<BasePaginatorSnakeSchema<TaskItemSchema>>(
    `${config.VITE_API_URL}/api/v1/ml/tasks/`,
    {
      params: {
        current_page: currentPage,
        batch_size: batchSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return convert(response.data);
};

const TableTask = ({ currentPage, batchSize }: Props) => {
  const [data, setData] = useState<BasePaginatorSchema<TaskSchema> | null>(null);
  const { accessToken } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate(0);
      return;
    }

    fetchData(accessToken, currentPage, batchSize)
      .then(result => {
        setData(result);
      })
      .catch(err => console.log(err));
  }, [accessToken, currentPage, batchSize]);

  if (!data) {
    return (
      <div className="overflow-auto rounded-md border">
        <div className="p-4 text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="w-full md:col-start-2 mx-auto">
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Создано</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              data.data.map(elem => (
                <TableRow key={elem.id}>
                  <TableCell>
                    <Link to={`/${elem.id}/`}>{elem.id}</Link>
                  </TableCell>
                  <TableCell>{elem.status}</TableCell>
                  <TableCell>{elem.createdOn.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        {data.currentPage > 1 && (
          <Button variant="outline">
            <Link to={`/?currentPage=${data.currentPage - 1}&batchSize=${data.batchSize}`}>Назад</Link>
          </Button>
        )}
        <span>
          Страница {data.currentPage} из {data.totalPages}
        </span>
        {data.currentPage < data.totalPages && (
          <Button variant="outline">
            <Link to={`/?currentPage=${data.currentPage + 1}&batchSize=${data.batchSize}`}>Вперёд</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableTask;
