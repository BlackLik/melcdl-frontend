import { cn } from '@/lib/utils';

const Header = ({ className, children, ...props }: React.ComponentProps<'header'>) => {
  return (
    <header className={cn('flex flex-col md:flex-row md:items-center md:justify-between', className)} {...props}>
      {children}
    </header>
  );
};

export default Header;
