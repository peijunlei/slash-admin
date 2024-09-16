import { checkAuth } from '@/utils/auth';

interface AuthWrapperProps extends React.PropsWithChildren {
  funcCode: string;
}
function AuthWrapper({ funcCode, children }: AuthWrapperProps) {
  const hasAuth = checkAuth(funcCode);
  return hasAuth ? children : null;
}

export default AuthWrapper;
