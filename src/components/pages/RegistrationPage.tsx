import Wrapper from '@/components/layout/Wrapper';
import { LoginForm } from '@/components/widgets/LoginForm';

const LoginPage = () => {
  return (
    <Wrapper showOnlyMain>
      <div className="w-full md:col-start-2 p-4 max-w-md mx-auto mt-52 md:p-0 md:mt-96">
        <LoginForm />
      </div>
    </Wrapper>
  );
};

export default LoginPage;
