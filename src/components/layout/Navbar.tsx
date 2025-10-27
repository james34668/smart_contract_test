import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, LayoutDashboard, TrendingUp, User } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { account, isConnecting, connectWallet, disconnectWallet, isConnected } = useWeb3();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    disconnectWallet();
    toast({
      title: "Signed out successfully",
    });
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/lend', label: 'Lend', icon: TrendingUp },
    { path: '/borrow', label: 'Borrow', icon: Wallet },
    { path: '/portfolio', label: 'Portfolio', icon: User },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold">
              SimpleLending
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                variant="default"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-md bg-accent text-sm font-mono">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
