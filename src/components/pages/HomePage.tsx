import Wrapper from '@/components/layout/Wrapper';
import TableTask from '@/components/widgets/TableTask';
import { useSearchParams } from 'react-router';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get('currentPage') || '1', 10);
  const sizeParam = parseInt(searchParams.get('batchSize') || '100', 10);

  const batchOptions = [1, 10, 50, 100];

  const handleSizeChange = (val: number) => {
    setSearchParams({ batchSize: String(val) });
  };

  return (
    <Wrapper>
      <div className="flex flex-col w-full md:col-start-2 mx-auto gap-4">
        <h1 className="text-3xl font-bold">Список задач</h1>

        <div className="flex items-center space-x-2">
          <span className="font-medium">Batch size:</span>
          <Select value={String(sizeParam)} onValueChange={val => handleSizeChange(Number(val))}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Выбрать" />
            </SelectTrigger>
            <SelectContent>
              {batchOptions.map(opt => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TableTask currentPage={pageParam} batchSize={sizeParam} />
      </div>
    </Wrapper>
  );
};

export default Home;
