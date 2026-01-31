import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  field_type: string;
  label: string;
  description: string | null;
  options: string[] | null;
  is_required: boolean;
  display_order: number;
}

interface BlogForm {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
}

interface BlogFormDisplayProps {
  postId: string;
}

// Get or create a session ID for form submissions
const getSessionId = () => {
  let sessionId = localStorage.getItem('blog_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('blog_session_id', sessionId);
  }
  return sessionId;
};

export function BlogFormDisplay({ postId }: BlogFormDisplayProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<BlogForm | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<Record<string, string | boolean | Date>>({});
  const [existingSubmission, setExistingSubmission] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [postId]);

  const fetchForm = async () => {
    setIsLoading(true);
    
    // Fetch the form for this post
    const { data: formData, error: formError } = await supabase
      .from('blog_post_forms')
      .select('*')
      .eq('post_id', postId)
      .eq('is_active', true)
      .maybeSingle();

    if (formError || !formData) {
      setIsLoading(false);
      return;
    }

    setForm(formData);

    // Fetch form fields
    const { data: fieldsData } = await supabase
      .from('blog_form_fields')
      .select('*')
      .eq('form_id', formData.id)
      .order('display_order', { ascending: true });

    if (fieldsData) {
      setFields(fieldsData.map(f => ({
        ...f,
        options: f.options as string[] | null,
      })));
    }

    // Check for existing submission
    const sessionId = getSessionId();
    const { data: submission } = await supabase
      .from('blog_form_submissions')
      .select('id, responses')
      .eq('form_id', formData.id)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (submission) {
      setExistingSubmission(submission.id);
      // Parse existing responses
      const existingResponses = submission.responses as Record<string, string | boolean>;
      const parsedResponses: Record<string, string | boolean | Date> = {};
      
      for (const [key, value] of Object.entries(existingResponses)) {
        // Try to parse dates
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          parsedResponses[key] = new Date(value);
        } else {
          parsedResponses[key] = value;
        }
      }
      
      setResponses(parsedResponses);
      setHasSubmitted(true);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate required fields
    for (const field of fields) {
      if (field.is_required) {
        const value = responses[field.id];
        if (value === undefined || value === '' || value === false) {
          toast({
            title: 'Required field missing',
            description: `Please complete the field: ${field.label}`,
            variant: 'destructive',
          });
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();
      
      // Convert responses for storage (dates to ISO strings)
      const storedResponses: Record<string, string | boolean> = {};
      for (const [key, value] of Object.entries(responses)) {
        if (value instanceof Date) {
          storedResponses[key] = value.toISOString();
        } else {
          storedResponses[key] = value;
        }
      }

      if (existingSubmission) {
        // Update existing submission
        const { error } = await supabase
          .from('blog_form_submissions')
          .update({
            responses: storedResponses,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubmission);

        if (error) throw error;

        toast({
          title: 'Response updated',
          description: 'Your form response has been updated.',
        });
      } else {
        // Create new submission
        const { data, error } = await supabase
          .from('blog_form_submissions')
          .insert({
            form_id: form.id,
            session_id: sessionId,
            responses: storedResponses,
          })
          .select('id')
          .single();

        if (error) throw error;

        setExistingSubmission(data.id);
        toast({
          title: 'Response submitted',
          description: 'Thank you for completing the form!',
        });
      }

      setHasSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldId: string, value: string | boolean | Date) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  if (isLoading) {
    return null;
  }

  if (!form || fields.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 rounded-lg border border-border bg-secondary/20">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {form.title}
        </h3>
        {form.description && (
          <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
        )}
      </div>

      {hasSubmitted && existingSubmission && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/10 text-primary">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">
            You've already submitted this form. You can update your response below.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-1">
              {field.label}
              {field.is_required && <span className="text-destructive">*</span>}
            </Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}

            {field.field_type === 'text' && (
              <Input
                value={(responses[field.id] as string) || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder="Your answer"
              />
            )}

            {field.field_type === 'multiple_choice' && field.options && (
              <RadioGroup
                value={(responses[field.id] as string) || ''}
                onValueChange={(value) => handleInputChange(field.id, value)}
              >
                {field.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                    <Label htmlFor={`${field.id}-${idx}`} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {field.field_type === 'checkbox' && field.options && field.options.length > 0 ? (
              <div className="space-y-2">
                {field.options.map((option, idx) => {
                  const selectedOptions = (responses[field.id] as string) || '';
                  const selectedArray = selectedOptions ? selectedOptions.split('|||') : [];
                  const isChecked = selectedArray.includes(option);
                  
                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${idx}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          let newSelected: string[];
                          if (checked) {
                            newSelected = [...selectedArray, option];
                          } else {
                            newSelected = selectedArray.filter(o => o !== option);
                          }
                          handleInputChange(field.id, newSelected.join('|||'));
                        }}
                      />
                      <Label htmlFor={`${field.id}-${idx}`} className="font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </div>
            ) : field.field_type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={(responses[field.id] as boolean) || false}
                  onCheckedChange={(checked) => handleInputChange(field.id, checked === true)}
                />
                <Label htmlFor={field.id} className="font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
            )}

            {field.field_type === 'date' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !responses[field.id] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {responses[field.id] instanceof Date
                      ? format(responses[field.id] as Date, "PPP")
                      : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={responses[field.id] as Date | undefined}
                    onSelect={(date) => date && handleInputChange(field.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : existingSubmission ? (
            'Update Response'
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </div>
  );
}
