
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Bell, User, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authService } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const user = authService.getCurrentUser();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would navigate to search results
    console.log('Searching for:', searchQuery);
  };

  const isAuthenticated = authService.isAuthenticated();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="mr-4 flex md:hidden">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <label htmlFor="sidebar-mobile-toggle" className="cursor-pointer">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </label>
          </Button>
        </div>
        
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <span className="text-primary-foreground font-semibold text-lg">E</span>
            </div>
            <span className="font-bold text-lg hidden lg:inline-block">EduHub</span>
          </Link>
        </div>
        
        {isAuthenticated && (
          <form onSubmit={handleSearch} className="flex-1 ml-4 md:ml-8 mr-4 md:mr-8">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="pl-8 bg-muted/30 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        )}
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/credits">
                      <div className="flex w-full justify-between items-center">
                        <span>Credits</span>
                        <Badge variant="outline" className="ml-2">{user?.credits}</Badge>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      authService.logout().then(() => {
                        window.location.href = '/login';
                      });
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Button asChild variant="ghost">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
              {location.pathname !== '/register' && (
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
