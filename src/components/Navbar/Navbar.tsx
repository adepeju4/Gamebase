import Cookies from 'universal-cookie';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import StatusDot from '../ui/StatusDot';
import { UserStatus } from '../../types/index';

function Navbar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setGame = useStoreActions(state => state.setActiveGame);
  const setUser = useStoreActions(state => state.setUser);

  const location = useLocation();
  const userName = cookies.get('userName') || 'User';
  const firstName = cookies.get('firstName') || '';
  const lastName = cookies.get('lastName') || '';
  const status = useStoreState((state: any) => state.user?.status) as UserStatus | undefined;

  const handleLogOut = () => {
    cookies.remove('userId');
    cookies.remove('userName');
    cookies.remove('firstName');
    cookies.remove('lastName');
    cookies.remove('email');
    cookies.remove('hashedPassword');
    cookies.remove('token');
    setUser(null);
    navigate('/login');
  };

  const handleBack = () => {
    setGame('');
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center">
        {location.pathname === '/join' && (
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            ← Back
          </Button>
        )}
        <h1 className="text-2xl font-bold text-white">Games FM</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}`} />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <StatusDot status={status} className="absolute bottom-0 right-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/')}>Games</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
