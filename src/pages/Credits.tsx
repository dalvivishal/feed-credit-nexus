
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { creditService, CreditTransaction } from '@/lib/api';
import { Loader2, ArrowUp, ArrowDown, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const Credits = () => {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [spendDialogOpen, setSpendDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchCreditsData = async () => {
      try {
        const [creditsData, transactionsData] = await Promise.all([
          creditService.getUserCredits(),
          creditService.getTransactionHistory()
        ]);
        
        setCredits(creditsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching credits data:', error);
        toast.error('Failed to load credits information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreditsData();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const renderTransactionIcon = (type: 'earned' | 'spent') => {
    if (type === 'earned') {
      return <Plus className="h-4 w-4 text-green-500" />;
    }
    return <Minus className="h-4 w-4 text-red-500" />;
  };
  
  // Mock function to spend credits on premium features
  const spendCreditsOn = async (item: string, amount: number) => {
    try {
      if (credits < amount) {
        toast.error('Insufficient credits');
        return;
      }
      
      await creditService.spendCredits(amount, `Purchased ${item}`);
      
      // Refresh data
      const [newCredits, newTransactions] = await Promise.all([
        creditService.getUserCredits(),
        creditService.getTransactionHistory()
      ]);
      
      setCredits(newCredits);
      setTransactions(newTransactions);
      
      toast.success(`Successfully purchased ${item}`);
    } catch (error) {
      toast.error('Failed to process the purchase');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Credit Center</h1>
        <p className="text-muted-foreground mt-2">
          Manage your credits and view transaction history
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-4xl font-bold text-primary">
              {credits} <span className="text-sm text-muted-foreground">credits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use credits to unlock premium content and features
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>How to Earn Credits</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="outline">+5</Badge>
                <span>Save content for later</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">+10</Badge>
                <span>Watch educational content</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">+15</Badge>
                <span>Share content with others</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Premium Features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>50</Badge>
                  <span className="text-sm">Advanced Course</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => spendCreditsOn('Advanced Course', 50)}>
                  Redeem
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>75</Badge>
                  <span className="text-sm">Expert Webinar Access</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => spendCreditsOn('Expert Webinar Access', 75)}>
                  Redeem
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge>100</Badge>
                  <span className="text-sm">1-on-1 Mentoring Session</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => spendCreditsOn('1-on-1 Mentoring Session', 100)}>
                  Redeem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View your recent credit transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="spent">Spent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TransactionTable 
                transactions={transactions} 
                formatDate={formatDate} 
                renderTransactionIcon={renderTransactionIcon} 
              />
            </TabsContent>
            
            <TabsContent value="earned">
              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'earned')} 
                formatDate={formatDate} 
                renderTransactionIcon={renderTransactionIcon} 
              />
            </TabsContent>
            
            <TabsContent value="spent">
              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'spent')} 
                formatDate={formatDate} 
                renderTransactionIcon={renderTransactionIcon} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface TransactionTableProps {
  transactions: CreditTransaction[];
  formatDate: (date: string) => string;
  renderTransactionIcon: (type: 'earned' | 'spent') => React.ReactNode;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  formatDate, 
  renderTransactionIcon 
}) => {
  if (transactions.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No transactions found</p>;
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{formatDate(transaction.timestamp)}</TableCell>
              <TableCell>{transaction.reason}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {renderTransactionIcon(transaction.type)}
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell className={`text-right ${
                transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Credits;
