
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/apiService';
import { Loader2, Coins, ArrowDown, ArrowUp } from 'lucide-react';

const Credits = () => {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionFilter, setTransactionFilter] = useState('all');

  useEffect(() => {
    const fetchCreditsData = async () => {
      setLoading(true);
      try {
        // Get user's credit balance
        const creditBalance = await api.credits.getBalance();
        setCredits(creditBalance);

        // Get transaction history
        const type = transactionFilter !== 'all' ? transactionFilter : undefined;
        const transactionsData = await api.credits.getTransactionHistory(1, 50, type);
        setTransactions(transactionsData.data.transactions);
      } catch (error: any) {
        console.error('Error fetching credits data:', error);
        toast.error(error.message || 'Failed to load credit information');
      } finally {
        setLoading(false);
      }
    };

    fetchCreditsData();
  }, [transactionFilter]);

  const handleClaimDailyBonus = async () => {
    try {
      const result = await api.credits.claimDailyBonus();
      setCredits(result.newBalance);

      // Refresh transaction history
      const transactionsData = await api.credits.getTransactionHistory(1, 50);
      setTransactions(transactionsData.data.transactions);

    } catch (error: any) {
      toast.error(error.message || 'Failed to claim daily bonus');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Credits & Transactions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your credits and view your transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credit Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-500 mr-3" />
              <span className="text-3xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : credits}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Use credits to unlock premium features
            </p>
          </CardContent>
        </Card>

        {/* Daily Bonus Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Claim your daily bonus to earn free credits</p>
            <Button onClick={handleClaimDailyBonus} disabled={loading}>
              Claim Daily Bonus
            </Button>
          </CardContent>
        </Card>

        {/* How to Earn Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">How to Earn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Daily login bonus</span>
                <Badge>+25 credits</Badge>
              </li>
              <li className="flex justify-between">
                <span>Save content</span>
                <Badge>+5 credits</Badge>
              </li>
              <li className="flex justify-between">
                <span>Share content</span>
                <Badge>+10 credits</Badge>
              </li>
              <li className="flex justify-between">
                <span>Create content</span>
                <Badge>+20 credits</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent credit transactions</CardDescription>
            </div>
            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All transactions</SelectItem>
                <SelectItem value="credit">Credits earned</SelectItem>
                <SelectItem value="debit">Credits spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          {transaction.amount}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Coins className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No transactions yet</h3>
              <p className="text-muted-foreground mt-2">
                Your transaction history will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;