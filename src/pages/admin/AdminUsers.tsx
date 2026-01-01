import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { UserPlus, Trash2, Shield, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Admin {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_admins');
      
      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsAdding(true);
    try {
      const { data, error } = await supabase.rpc('add_admin_by_email', {
        _email: newAdminEmail.trim().toLowerCase()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };
      
      if (result.success) {
        toast.success(result.message || 'Admin added successfully');
        setNewAdminEmail('');
        fetchAdmins();
      } else {
        toast.error(result.error || 'Failed to add admin');
      }
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast.error(error.message || 'Failed to add admin');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAdmin = async (adminUserId: string, email: string) => {
    setRemovingId(adminUserId);
    try {
      const { data, error } = await supabase.rpc('remove_admin_by_email', {
        _email: email
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };
      
      if (result.success) {
        toast.success(result.message || 'Admin removed successfully');
        fetchAdmins();
      } else {
        toast.error(result.error || 'Failed to remove admin');
      }
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast.error(error.message || 'Failed to remove admin');
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Administrators</h1>
        <p className="text-muted-foreground mt-1">
          Add or remove admin access for users
        </p>
      </div>

      {/* Add Admin Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Administrator
          </CardTitle>
          <CardDescription>
            Enter the email address of a registered user to grant them admin access.
            The user must have already signed up for an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter email address"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1"
              disabled={isAdding}
            />
            <Button type="submit" disabled={isAdding}>
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Admins List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Administrators
          </CardTitle>
          <CardDescription>
            {admins.length} administrator{admins.length !== 1 ? 's' : ''} with access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No administrators found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.user_id}>
                    <TableCell className="font-medium">{admin.email}</TableCell>
                    <TableCell>{admin.full_name || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(admin.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {admin.user_id === user?.id ? (
                        <span className="text-xs text-muted-foreground">You</span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={removingId === admin.user_id}
                            >
                              {removingId === admin.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Administrator</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove admin access for <strong>{admin.email}</strong>?
                                They will no longer be able to access the admin dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveAdmin(admin.user_id, admin.email)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Admin
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
