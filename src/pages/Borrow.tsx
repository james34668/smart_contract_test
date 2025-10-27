import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrendingDown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ASSETS = ['USDC', 'DAI', 'USDT'] as const;

const Borrow = () => {
  const { toast } = useToast();
  const [asset, setAsset] = useState<string>('USDC');
  const [amount, setAmount] = useState('');
  const [collateral, setCollateral] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateRequiredCollateral = (borrowAmount: string) => {
    const amt = parseFloat(borrowAmount);
    if (isNaN(amt) || amt <= 0) return '0';
    return (amt * 1.5).toFixed(4);
  };

  const handleBorrow = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to borrow",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // TODO Implement lending logic
    toast({
      title: "Failed to borrow assets",
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
          <h1 className="text-4xl font-bold mb-2">Borrow Assets</h1>
          <p className="text-muted-foreground">Borrow against your collateral</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Borrow</CardTitle>
                <CardDescription>Borrow assets with ETH collateral (150% ratio)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must maintain a minimum collateral ratio of 150%. 
                    Positions below 100% health factor may be liquidated.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Asset to Borrow</Label>
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
                  <Label>Borrow Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setCollateral(calculateRequiredCollateral(e.target.value));
                    }}
                    step="0.01"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: 0.00 {asset}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Collateral (ETH)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={collateral}
                    onChange={(e) => setCollateral(e.target.value)}
                    step="0.0001"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required: {calculateRequiredCollateral(amount)} ETH (150% ratio)
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-accent space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Borrow APY</span>
                    <span className="font-semibold">4.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Liquidation Threshold</span>
                    <span className="font-semibold">80%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Health Factor</span>
                    <span className="font-semibold text-primary">1.50</span>
                  </div>
                </div>

                <Button
                  onClick={handleBorrow}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Borrowing...' : 'Borrow'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Borrow Rates
                </CardTitle>
                <CardDescription>Current APY rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ASSETS.map((a) => (
                  <div key={a} className="flex justify-between items-center p-3 rounded-lg bg-accent">
                    <span className="font-medium">{a}</span>
                    <span className="text-destructive font-bold">4.5%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Borrows</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active borrow positions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
