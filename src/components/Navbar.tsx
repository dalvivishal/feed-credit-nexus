
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { CreditCard, LogOut, Menu, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from './AppSidebar';
import api from '@/lib/apiService';
import { toast } from 'sonner';

export default function Navbar({ onNavItemClick }) {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = api.auth.getCurrentUser();
  const isAuthenticated = api.auth.isAuthenticated();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="border-b bg-background z-20 sticky top-0">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {isAuthenticated && (
          <div className="flex md:hidden mr-2">
            {isMobile ? (
              <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90%]">
                  <DrawerHeader>
                    <DrawerTitle>Navigation</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <AppSidebar />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
            <span className="text-primary-foreground font-semibold text-lg">E</span>
          </div>
          <Link to="/" className="font-bold text-xl">EduHub</Link>
        </div>

        <div className="flex-1" />

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {user?.credits !== undefined && (
              <Link to="/credits">
                <Button variant="outline" size="sm" className="hidden md:flex gap-1">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span>{user.credits} Credits</span>
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/credits')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Credits</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}