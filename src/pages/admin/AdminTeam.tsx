import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, Pencil, Trash2, UserRound } from 'lucide-react';

type TeamSection = 'board' | 'advisory';

interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  section: TeamSection;
  photo_url: string | null;
  display_order: number;
}

interface TeamFormState {
  name: string;
  role: string;
  section: TeamSection;
  photoUrl: string;
  displayOrder: number;
}

const SECTION_LABELS: Record<TeamSection, string> = {
  board: 'Board',
  advisory: 'Advisory',
};

const SECTION_ORDER: Record<TeamSection, number> = {
  board: 0,
  advisory: 1,
};

const DEFAULT_FORM: TeamFormState = {
  name: '',
  role: '',
  section: 'board',
  photoUrl: '',
  displayOrder: 0,
};

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<TeamFormState>(DEFAULT_FORM);

  const { user } = useAuth();
  const { toast } = useToast();

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const sectionDiff = SECTION_ORDER[a.section] - SECTION_ORDER[b.section];
      if (sectionDiff !== 0) return sectionDiff;

      const orderDiff = (a.display_order ?? 0) - (b.display_order ?? 0);
      if (orderDiff !== 0) return orderDiff;

      return a.name.localeCompare(b.name);
    });
  }, [members]);

  const boardMembers = sortedMembers.filter((member) => member.section === 'board');
  const advisoryMembers = sortedMembers.filter((member) => member.section === 'advisory');

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, role, section, photo_url, display_order');

      if (error) throw error;
      setMembers((data || []) as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormState(DEFAULT_FORM);
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormState({
      name: member.name,
      role: member.role || '',
      section: member.section,
      photoUrl: member.photo_url || '',
      displayOrder: member.display_order || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formState.name.trim();
    if (!name) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    const payload = {
      name,
      role: formState.role.trim() || null,
      section: formState.section,
      photo_url: formState.photoUrl.trim() || null,
      display_order: Number.isFinite(formState.displayOrder) ? formState.displayOrder : 0,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Team member updated',
          description: `${name} has been updated.`,
        });
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert({
            ...payload,
            created_by: user?.id,
          });

        if (error) throw error;

        toast({
          title: 'Team member added',
          description: `${name} has been added to ${SECTION_LABELS[formState.section]}.`,
        });
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to save team member.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      if (editingId === member.id) {
        resetForm();
      }

      toast({
        title: 'Team member removed',
        description: `${member.name} has been removed from the team.`,
      });

      fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const TeamSectionList = ({
    title,
    sectionMembers,
  }: {
    title: string;
    sectionMembers: TeamMember[];
  }) => {
    return (
      <div className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>

        {sectionMembers.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">
            No members in this section yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sectionMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-soft sm:flex-row sm:items-center"
              >
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="h-16 w-16 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
                    <UserRound size={20} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role || 'No role specified'}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Display order: {member.display_order ?? 0}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(member)}
                    className="gap-2"
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove team member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Remove {member.name} from the Rith Team? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(member)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Rith Team</h1>
        <p className="text-sm text-muted-foreground">
          Add, update, and remove board and advisory members shown on the About page.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border/50 bg-card p-6 shadow-soft"
      >
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {editingId ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Changes here are reflected in the About page Rith Team section.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="member-name">Name *</Label>
            <Input
              id="member-name"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Input
              id="member-role"
              value={formState.role}
              onChange={(e) => setFormState((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="President, Advisor, etc."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Section *</Label>
            <Select
              value={formState.section}
              onValueChange={(value: TeamSection) => setFormState((prev) => ({ ...prev, section: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="board">Board</SelectItem>
                <SelectItem value="advisory">Advisory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-order">Display Order</Label>
            <Input
              id="display-order"
              type="number"
              value={formState.displayOrder}
              onChange={(e) => {
                const nextValue = Number(e.target.value);
                setFormState((prev) => ({
                  ...prev,
                  displayOrder: Number.isNaN(nextValue) ? 0 : nextValue,
                }));
              }}
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
          </div>
        </div>

        <ImageUpload
          value={formState.photoUrl}
          onChange={(url) => setFormState((prev) => ({ ...prev, photoUrl: url }))}
          label="Profile Image"
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editingId ? (
              'Update Team Member'
            ) : (
              'Add Team Member'
            )}
          </Button>

          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-8">
        <TeamSectionList title="Board" sectionMembers={boardMembers} />
        <TeamSectionList title="Advisory" sectionMembers={advisoryMembers} />
      </div>
    </div>
  );
}
