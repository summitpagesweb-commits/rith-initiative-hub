import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
import { Plus, Trash2, ListPlus } from 'lucide-react';

export type QuestionFieldType = 'multiple_choice' | 'checkbox' | 'short_answer' | 'long_answer';

export interface FormField {
  id?: string;
  field_type: 'section' | QuestionFieldType;
  label: string;
  description?: string;
  options?: string[];
  allow_other?: boolean;
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

export interface FormBuilderHandle {
  getFormData: () => FormData | null;
}

interface SectionGroup {
  section: FormField;
  sectionIndex: number;
  sectionNumber: number;
  questions: Array<{ field: FormField; index: number }>;
}

const QUESTION_TYPES: Array<{ value: QuestionFieldType; label: string }> = [
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'short_answer', label: 'Short answer' },
  { value: 'long_answer', label: 'Long answer' },
];

type StoredOptions = string[] | { choices?: string[]; allow_other?: boolean } | null;

const parseStoredOptions = (options: StoredOptions | unknown) => {
  if (typeof options === 'string') {
    try {
      return parseStoredOptions(JSON.parse(options));
    } catch {
      return { choices: [], allowOther: false };
    }
  }

  if (Array.isArray(options)) {
    return { choices: options.filter((option): option is string => typeof option === 'string'), allowOther: false };
  }

  if (options && typeof options === 'object') {
    const optionConfig = options as { choices?: unknown; allow_other?: unknown };
    return {
      choices: Array.isArray(optionConfig.choices)
        ? optionConfig.choices.filter((option): option is string => typeof option === 'string')
        : [],
      allowOther: optionConfig.allow_other === true,
    };
  }

  return { choices: [], allowOther: false };
};

const normalizeFieldType = (fieldType: string): FormField['field_type'] => {
  if (fieldType === 'text' || fieldType === 'date') return 'short_answer';
  if (fieldType === 'section' || fieldType === 'multiple_choice' || fieldType === 'checkbox' || fieldType === 'long_answer') {
    return fieldType;
  }
  return 'short_answer';
};

const isChoiceField = (fieldType: FormField['field_type']) =>
  fieldType === 'multiple_choice' || fieldType === 'checkbox';

const createSection = (displayOrder: number): FormField => ({
  field_type: 'section',
  label: '',
  description: '',
  is_required: false,
  display_order: displayOrder,
});

const createQuestion = (displayOrder: number): FormField => ({
  field_type: 'short_answer',
  label: '',
  description: '',
  is_required: false,
  display_order: displayOrder,
});

const reorderFields = (fields: FormField[]) =>
  fields.map((field, index) => ({ ...field, display_order: index }));

const ensureSectionLayout = (fields: FormField[]) => {
  if (fields.length === 0) return fields;
  if (fields[0].field_type === 'section') return fields;

  return [
    {
      ...createSection(0),
      label: 'Section 1',
    },
    ...fields,
  ];
};

export const FormBuilder = forwardRef<FormBuilderHandle, FormBuilderProps>(function FormBuilder(
  { postId, onFormChange },
  ref
) {
  const [hasForm, setHasForm] = useState(false);
  const [isFetchingForm, setIsFetchingForm] = useState(Boolean(postId));
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    is_active: true,
    fields: [],
  });

  useEffect(() => {
    if (postId) {
      fetchExistingForm();
    } else {
      setIsFetchingForm(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isFetchingForm) return;
    onFormChange(hasForm ? formData : null);
  }, [hasForm, formData, isFetchingForm, onFormChange]);

  useImperativeHandle(ref, () => ({
    getFormData: () => (hasForm ? formData : null),
  }), [formData, hasForm]);

  const fetchExistingForm = async () => {
    if (!postId) return;

    setIsFetchingForm(true);
    const { data: form, error } = await supabase
      .from('blog_post_forms')
      .select('*')
      .eq('post_id', postId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching form:', error);
      setIsFetchingForm(false);
      return;
    }

    if (form) {
      const { data: fields, error: fieldsError } = await supabase
        .from('blog_form_fields')
        .select('*')
        .eq('form_id', form.id)
        .order('display_order', { ascending: true });

      if (fieldsError) {
        console.error('Error fetching form fields:', fieldsError);
      }

      setFormData({
        id: form.id,
        title: form.title,
        description: form.description || '',
        is_active: form.is_active,
        fields: reorderFields(ensureSectionLayout((fields || []).map((field) => {
          const parsedOptions = parseStoredOptions(field.options);
          const fieldType = normalizeFieldType(field.field_type);
          return {
            id: field.id,
            field_type: fieldType,
            label: field.label,
            description: field.description || undefined,
            options: parsedOptions.choices,
            allow_other: parsedOptions.allowOther,
            is_required: fieldType === 'section' ? false : field.is_required,
            display_order: field.display_order || 0,
          };
        }))),
      });
      setHasForm(true);
    }

    setIsFetchingForm(false);
  };

  const updateFields = (updater: (fields: FormField[]) => FormField[]) => {
    setFormData((prev) => ({
      ...prev,
      fields: reorderFields(updater(prev.fields)),
    }));
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

  const addSection = () => {
    updateFields((fields) => [...fields, createSection(fields.length)]);
  };

  const addQuestionToSection = (sectionIndex: number) => {
    updateFields((fields) => {
      let insertAt = sectionIndex + 1;
      while (insertAt < fields.length && fields[insertAt].field_type !== 'section') {
        insertAt += 1;
      }
      const nextFields = [...fields];
      nextFields.splice(insertAt, 0, createQuestion(insertAt));
      return nextFields;
    });
  };

  const removeField = (index: number) => {
    updateFields((fields) => fields.filter((_, fieldIndex) => fieldIndex !== index));
  };

  const removeSection = (sectionIndex: number) => {
    updateFields((fields) => {
      const endIndex = fields.findIndex((field, index) => index > sectionIndex && field.field_type === 'section');
      const removeUntil = endIndex === -1 ? fields.length : endIndex;
      return fields.filter((_, index) => index < sectionIndex || index >= removeUntil);
    });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    updateFields((fields) => fields.map((field, fieldIndex) => (
      fieldIndex === index ? { ...field, ...updates } : field
    )));
  };

  const updateQuestionType = (index: number, fieldType: QuestionFieldType) => {
    updateField(index, {
      field_type: fieldType,
      options: isChoiceField(fieldType) ? [''] : undefined,
      allow_other: false,
    });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    updateFields((fields) => fields.map((field, index) => {
      if (index !== fieldIndex) return field;
      const options = [...(field.options || [])];
      options[optionIndex] = value;
      return { ...field, options };
    }));
  };

  const addOption = (fieldIndex: number) => {
    updateFields((fields) => fields.map((field, index) => (
      index === fieldIndex ? { ...field, options: [...(field.options || []), ''] } : field
    )));
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    updateFields((fields) => fields.map((field, index) => (
      index === fieldIndex
        ? { ...field, options: (field.options || []).filter((_, optionIndexToKeep) => optionIndexToKeep !== optionIndex) }
        : field
    )));
  };

  const getSections = (): SectionGroup[] => {
    const sections: SectionGroup[] = [];

    formData.fields.forEach((field, index) => {
      if (field.field_type === 'section') {
        sections.push({
          section: field,
          sectionIndex: index,
          sectionNumber: sections.length + 1,
          questions: [],
        });
        return;
      }

      if (sections.length > 0) {
        sections[sections.length - 1].questions.push({ field, index });
      }
    });

    return sections;
  };

  const sections = getSections();

  if (isFetchingForm) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-foreground">Interactive Form</h3>
          <p className="text-sm text-muted-foreground">Loading attached survey...</p>
        </div>
      </div>
    );
  }

  if (!hasForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-foreground">Interactive Form</h3>
            <p className="text-sm text-muted-foreground">
              Add a survey for readers to complete.
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
    <div className="space-y-6 rounded-lg border border-border bg-secondary/20 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-foreground">Interactive Form</h3>
          <p className="text-sm text-muted-foreground">Build the survey in sections.</p>
        </div>
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

      <div className="rounded-lg border border-border bg-background p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="space-y-2">
            <Label htmlFor="form_title">Form Title</Label>
            <Input
              id="form_title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Community Feedback Survey"
            />
          </div>
          <div className="flex items-center gap-3 rounded-md bg-secondary/40 p-3 sm:mt-6">
            <Switch
              id="form_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="form_active">Form Active</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="form_description">Description (optional)</Label>
          <Textarea
            id="form_description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief instructions for users..."
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-base">Sections</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSection}>
            <ListPlus size={14} className="mr-1" />
            Add Section
          </Button>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Add a section first, then add questions inside it.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.section.id || section.sectionIndex} className="rounded-lg border-2 border-primary/20 bg-background">
                <div className="border-b border-border bg-primary/5 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium uppercase text-primary">
                      Section {section.sectionNumber} of {sections.length}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.sectionIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete Section
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.section.label}
                        onChange={(e) => updateField(section.sectionIndex, { label: e.target.value })}
                        placeholder="Section title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Section Description (optional)</Label>
                      <Textarea
                        value={section.section.description || ''}
                        onChange={(e) => updateField(section.sectionIndex, { description: e.target.value })}
                        placeholder="Short intro for this section"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  {section.questions.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border px-4 py-6 text-center">
                      <p className="text-sm text-muted-foreground">No questions in this section yet.</p>
                    </div>
                  ) : (
                    section.questions.map(({ field, index }, questionIndex) => (
                      <div key={field.id || index} className="rounded-md border border-border bg-secondary/20 p-4 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            Question {questionIndex + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeField(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                          <div className="space-y-2">
                            <Label>Question</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(index, { label: e.target.value })}
                              placeholder="Question text"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Question Type</Label>
                            <Select
                              value={field.field_type as QuestionFieldType}
                              onValueChange={(value) => updateQuestionType(index, value as QuestionFieldType)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {QUESTION_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description (optional)</Label>
                          <Input
                            value={field.description || ''}
                            onChange={(e) => updateField(index, { description: e.target.value })}
                            placeholder="Help text for this question"
                          />
                        </div>

                        {isChoiceField(field.field_type) && (
                          <div className="space-y-3">
                            <div>
                              <Label>{field.field_type === 'checkbox' ? 'Checkbox Options' : 'Multiple Choice Options'}</Label>
                              <p className="text-xs text-muted-foreground">
                                {field.field_type === 'checkbox'
                                  ? 'Users can select more than one answer.'
                                  : 'Users can select one answer.'}
                              </p>
                            </div>
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
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <Button type="button" variant="ghost" size="sm" onClick={() => addOption(index)}>
                                <Plus size={14} className="mr-1" />
                                Add Option
                              </Button>
                              <div className="flex items-center gap-3 rounded-md bg-background p-3">
                                <Switch
                                  checked={field.allow_other || false}
                                  onCheckedChange={(checked) => updateField(index, { allow_other: checked })}
                                />
                                <div>
                                  <Label>Allow "Other"</Label>
                                  <p className="text-xs text-muted-foreground">Adds an Other option with a text field.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={field.is_required}
                            onCheckedChange={(checked) => updateField(index, { is_required: checked })}
                          />
                          <Label>Required question</Label>
                        </div>
                      </div>
                    ))
                  )}

                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestionToSection(section.sectionIndex)}>
                    <Plus size={14} className="mr-1" />
                    Add Question to Section {section.sectionNumber}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
