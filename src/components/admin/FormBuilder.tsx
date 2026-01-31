import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface FormField {
  id?: string;
  field_type: 'multiple_choice' | 'date' | 'text' | 'checkbox';
  label: string;
  description?: string;
  options?: string[];
  is_required: boolean;
  display_order: number;
}

export interface FormData {
  id?: string;
  title: string;
  description?: string;
  is_active: boolean;
  fields: FormField[];
}

interface FormBuilderProps {
  postId?: string;
  onFormChange: (form: FormData | null) => void;
}

const FIELD_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'date', label: 'Date Picker' },
  { value: 'text', label: 'Text Input' },
  { value: 'checkbox', label: 'Checkbox' },
];

export function FormBuilder({ postId, onFormChange }: FormBuilderProps) {
  const [hasForm, setHasForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    is_active: true,
    fields: [],
  });

  // Fetch existing form when editing
  useEffect(() => {
    if (postId) {
      fetchExistingForm();
    }
  }, [postId]);

  // Notify parent of changes
  useEffect(() => {
    if (hasForm) {
      onFormChange(formData);
    } else {
      onFormChange(null);
    }
  }, [hasForm, formData, onFormChange]);

  const fetchExistingForm = async () => {
    if (!postId) return;

    const { data: form, error } = await supabase
      .from('blog_post_forms')
      .select('*')
      .eq('post_id', postId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching form:', error);
      return;
    }

    if (form) {
      // Fetch fields
      const { data: fields } = await supabase
        .from('blog_form_fields')
        .select('*')
        .eq('form_id', form.id)
        .order('display_order', { ascending: true });

      setFormData({
        id: form.id,
        title: form.title,
        description: form.description || '',
        is_active: form.is_active,
        fields: (fields || []).map(f => ({
          id: f.id,
          field_type: f.field_type as FormField['field_type'],
          label: f.label,
          description: f.description || undefined,
          options: f.options as string[] || undefined,
          is_required: f.is_required,
          display_order: f.display_order || 0,
        })),
      });
      setHasForm(true);
    }
  };

  const handleEnableForm = () => {
    setHasForm(true);
    setFormData({
      title: 'Post Survey',
      description: '',
      is_active: true,
      fields: [],
    });
  };

  const handleDisableForm = () => {
    setHasForm(false);
    setFormData({
      title: '',
      description: '',
      is_active: true,
      fields: [],
    });
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          field_type: 'text',
          label: '',
          is_required: false,
          display_order: prev.fields.length,
        },
      ],
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields
        .filter((_, i) => i !== index)
        .map((f, i) => ({ ...f, display_order: i })),
    }));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, ...updates } : f
      ),
    }));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setFormData(prev => {
      const newFields = [...prev.fields];
      const [moved] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, moved);
      return {
        ...prev,
        fields: newFields.map((f, i) => ({ ...f, display_order: i })),
      };
    });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => {
        if (i !== fieldIndex) return f;
        const options = [...(f.options || [])];
        options[optionIndex] = value;
        return { ...f, options };
      }),
    }));
  };

  const addOption = (fieldIndex: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => {
        if (i !== fieldIndex) return f;
        return { ...f, options: [...(f.options || []), ''] };
      }),
    }));
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => {
        if (i !== fieldIndex) return f;
        return { ...f, options: (f.options || []).filter((_, oi) => oi !== optionIndex) };
      }),
    }));
  };

  if (!hasForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Interactive Form</h3>
            <p className="text-sm text-muted-foreground">
              Add a form for readers to interact with
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleEnableForm}>
            <Plus size={16} className="mr-2" />
            Add Form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 rounded-lg border border-border bg-secondary/20">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Interactive Form</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDisableForm}
          className="text-destructive hover:text-destructive"
        >
          Remove Form
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="form_title">Form Title</Label>
            <Input
              id="form_title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Quick Survey"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="form_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="form_active">Form Active</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="form_description">Form Description (optional)</Label>
          <Textarea
            id="form_description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief instructions for users..."
            rows={2}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Form Fields</Label>
          <Button type="button" variant="outline" size="sm" onClick={addField}>
            <Plus size={14} className="mr-1" />
            Add Field
          </Button>
        </div>

        {formData.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No fields yet. Click "Add Field" to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.fields.map((field, index) => (
              <div
                key={field.id || index}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', index.toString());
                  (e.target as HTMLElement).classList.add('opacity-50');
                }}
                onDragEnd={(e) => {
                  (e.target as HTMLElement).classList.remove('opacity-50');
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                  moveField(fromIndex, index);
                }}
                className="p-4 rounded-lg border border-border bg-background space-y-4"
              >
                <div className="flex items-start gap-2">
                  <GripVertical size={20} className="text-muted-foreground mt-2 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                  <div className="flex-1 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Field Type</Label>
                        <Select
                          value={field.field_type}
                          onValueChange={(value) => updateField(index, { 
                            field_type: value as FormField['field_type'],
                            options: (value === 'multiple_choice' || value === 'checkbox') ? [''] : undefined,
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          placeholder="Question or field name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description (optional)</Label>
                      <Input
                        value={field.description || ''}
                        onChange={(e) => updateField(index, { description: e.target.value })}
                        placeholder="Help text for this field"
                      />
                    </div>

                    {(field.field_type === 'multiple_choice' || field.field_type === 'checkbox') && (
                      <div className="space-y-2">
                        <Label>{field.field_type === 'checkbox' ? 'Checkbox Options' : 'Options'}</Label>
                        <p className="text-xs text-muted-foreground">
                          {field.field_type === 'checkbox' 
                            ? 'Users can select multiple options' 
                            : 'Users can select one option'}
                        </p>
                        <div className="space-y-2">
                          {(field.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addOption(index)}
                          >
                            <Plus size={14} className="mr-1" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={field.is_required}
                        onCheckedChange={(checked) => updateField(index, { is_required: checked })}
                      />
                      <Label>Required field</Label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
