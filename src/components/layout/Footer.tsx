import { cn } from '@/lib/utils';

const Footer = ({ className, children, ...props }: React.ComponentProps<'footer'>) => {
  return (
    <footer className={cn(className)} {...props}>
      {children}
    </footer>
  );
};

export default Footer;
