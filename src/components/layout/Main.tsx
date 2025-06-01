import { cn } from '@/lib/utils';

const Main = ({ className, children, ...props }: React.ComponentProps<'main'>) => {
  return (
    <main className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 p-4', className)} {...props}>
      {children}
    </main>
  );
};

export default Main;
