
import React, { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Flag, Award, User } from 'lucide-react';
import { authAPI } from '@/lib/services/authService';
import { adminAPI } from '@/lib/services/adminService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isAdmin = authAPI.isAdmin();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminAPI.getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, isAdmin]);

  if (!isAdmin) {
    return null; // Already handled in useEffect with redirect
  }

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Dummy chart data
  const activityData = [
    { name: 'Mon', users: 120, content: 15 },
    { name: 'Tue', users: 150, content: 20 },
    { name: 'Wed', users: 180, content: 25 },
    { name: 'Thu', users: 170, content: 22 },
    { name: 'Fri', users: 190, content: 30 },
    { name: 'Sat', users: 220, content: 35 },
    { name: 'Sun', users: 200, content: 28 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform activity and manage users
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +22% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              -2 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>User engagement and content creation over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8B5CF6" name="Active Users" />
                <Bar dataKey="content" fill="#D8B4FE" name="New Content" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Active Users</CardTitle>
            <CardDescription>Users with the highest credit activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.mostActiveUsers && stats.mostActiveUsers?.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{user.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Saved Content</CardTitle>
            <CardDescription>Content with the highest user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topSavedContent && stats.topSavedContent.map((content: any) => (
                  <TableRow key={content._id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{content.source}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{content.savedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
