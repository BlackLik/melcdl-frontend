import { cn } from '@/lib/utils';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';

interface Props extends React.ComponentProps<'main'> {
  showOnlyMain?: boolean;
}

const Wrapper = ({ className, children, showOnlyMain = false, ...props }: Props) => {
  return (
    <div className="h-dvh flex flex-col">
      {!showOnlyMain && <Header />}
      <Main className={cn(className)} {...props}>
        {children}
      </Main>
      {!showOnlyMain && <Footer />}
    </div>
  );
};

export default Wrapper;
