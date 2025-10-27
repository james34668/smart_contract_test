import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp } from 'lucide-react';

const ASSETS = ['USDC', 'DAI', 'USDT'] as const;

const Lend = () => {
  const { toast } = useToast();
  const [asset, setAsset] = useState<string>('USDC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);
  const [rates, setRates] = useState<any>({});

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to borrow",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // TODO Implement lending logic
    toast({
      title: "Failed to deposit assets",
      description: "LendingPool.sol not deployed yet",
      variant: "destructive",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Lend Assets</h1>
          <p className="text-muted-foreground">Deposit assets to earn interest</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Deposit</CardTitle>
                <CardDescription>Supply assets to the lending pool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Asset</Label>
                  <Select value={asset} onValueChange={setAsset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSETS.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Balance: 0.00 {asset}
                  </p>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Depositing...' : 'Deposit'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Interest Rates
                </CardTitle>
                <CardDescription>Current APY rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ASSETS.map((a) => (
                  <div key={a} className="flex justify-between items-center p-3 rounded-lg bg-accent">
                    <span className="font-medium">{a}</span>
                    <span className="text-primary font-bold">
                      {rates[a]?.lending || '0'}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active lending positions
                  </p>
                ) : (
                  <div className="space-y-3">
                    {positions.map((position) => (
                      <div key={position.id} className="p-3 rounded-lg bg-accent">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{position.asset}</span>
                          <span className="text-sm">{position.amount}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          APY: {position.interest_rate}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lend;