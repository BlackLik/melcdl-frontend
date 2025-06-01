import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const Header = ({ className, children, ...props }: React.ComponentProps<'header'>) => {
  const { logout } = useAuthStore();

  return (
    <header
      className={cn(
        'px-4 py-3 bg-gray-50 shadow-sm flex flex-col md:flex-row md:items-center md:justify-center',
        className,
      )}
      {...props}
    >
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4 items-center">
          {/* Кнопка “Главная” */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200">
                Главная
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Кнопка “Выйти” */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/login/"
                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200"
                onClick={() => logout()}
              >
                Выйти
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Header;
