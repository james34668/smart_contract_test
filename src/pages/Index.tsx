import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold">SimpleLending</h1>
            <Button onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
          <div className="max-w-3xl mx-auto space-y-8 py-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Simple DeFi Lending
              <span className="block text-primary mt-2">Lend. Borrow. Earn.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined DeFi platform for lending and borrowing crypto assets with ease.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-20">
            <div className="p-6 rounded-lg border border-border bg-card">
              <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Secure & Tested</h3>
              <p className="text-muted-foreground">
                Production-ready smart contracts with comprehensive security measures
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Dynamic Rates</h3>
              <p className="text-muted-foreground">
                Interest rates calculated based on utilization in real-time
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <Zap className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Full-Stack</h3>
              <p className="text-muted-foreground">
                Complete integration with frontend, backend, and blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
