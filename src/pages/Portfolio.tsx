import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track all your positions and transactions</p>
        </div>

        <Tabs defaultValue="lending" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="lending">Lending</TabsTrigger>
            <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="lending">
            <Card>
              <CardHeader>
                <CardTitle>Lending Positions</CardTitle>
                <CardDescription>Your active lending positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>No active lending positions</p>
                  <p className="text-sm mt-2">Start lending to see your positions here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrowing">
            <Card>
              <CardHeader>
                <CardTitle>Borrowing Positions</CardTitle>
                <CardDescription>Your active borrow positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>No active borrow positions</p>
                  <p className="text-sm mt-2">Start borrowing to see your positions here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>No transaction history</p>
                  <p className="text-sm mt-2">Your transactions will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
