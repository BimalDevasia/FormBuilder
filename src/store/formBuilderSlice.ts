import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'derived' | 'checkbox-group';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select, radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    // Password validation
    isPassword?: boolean;
    requireNumber?: boolean;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireSpecialChar?: boolean;
  };
  order: number;
  // Derived field properties
  isDerived?: boolean;
  parentFields?: string[]; // IDs of parent fields
  derivationFormula?: string; // Formula for computation
  derivationType?: 'age_from_dob' | 'sum' | 'difference' | 'custom';
  // Grouping properties for checkbox/radio
  groupName?: string; // For grouping checkboxes/radios
  groupOptions?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

export interface SavedForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormState {
  title: string;
  description: string;
  fields: FormField[];
  isPreviewMode: boolean;
  selectedFieldId: string | null;
  savedForms: SavedForm[];
  currentFormId: string | null;
}

const initialState: FormState = {
  title: '',
  description: '',
  fields: [],
  isPreviewMode: false,
  selectedFieldId: null,
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
  currentFormId: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setFormDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: state.fields.length,
      };
      state.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      const { id, updates } = action.payload;
      const fieldIndex = state.fields.findIndex(field => field.id === id);
      if (fieldIndex !== -1) {
        state.fields[fieldIndex] = { ...state.fields[fieldIndex], ...updates };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
      // Reorder remaining fields
      state.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload.map((field, index) => ({
        ...field,
        order: index,
      }));
    },
    duplicateField: (state, action: PayloadAction<string>) => {
      const fieldToDuplicate = state.fields.find(field => field.id === action.payload);
      if (fieldToDuplicate) {
        const duplicatedField: FormField = {
          ...fieldToDuplicate,
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          label: `${fieldToDuplicate.label} (Copy)`,
          order: state.fields.length,
        };
        state.fields.push(duplicatedField);
      }
    },
    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    togglePreviewMode: (state) => {
      state.isPreviewMode = !state.isPreviewMode;
      state.selectedFieldId = null;
    },
    clearForm: (state) => {
      state.title = 'Untitled Form';
      state.description = '';
      state.fields = [];
      state.selectedFieldId = null;
      state.currentFormId = null;
    },
    saveForm: (state) => {
      const now = new Date().toISOString();
      const formToSave: SavedForm = {
        id: state.currentFormId || `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: state.title,
        description: state.description,
        fields: state.fields,
        createdAt: state.currentFormId ? 
          state.savedForms.find(f => f.id === state.currentFormId)?.createdAt || now : 
          now,
        updatedAt: now,
      };

      const existingIndex = state.savedForms.findIndex(f => f.id === formToSave.id);
      if (existingIndex >= 0) {
        state.savedForms[existingIndex] = formToSave;
      } else {
        state.savedForms.unshift(formToSave);
      }
      
      state.currentFormId = formToSave.id;
      
      // Persist to localStorage
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const formToLoad = state.savedForms.find(f => f.id === action.payload);
      if (formToLoad) {
        state.title = formToLoad.title;
        state.description = formToLoad.description;
        state.fields = formToLoad.fields;
        state.currentFormId = formToLoad.id;
        state.selectedFieldId = null;
        state.isPreviewMode = false;
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      if (state.currentFormId === action.payload) {
        state.currentFormId = null;
        state.title = 'Untitled Form';
        state.description = '';
        state.fields = [];
        state.selectedFieldId = null;
      }
      
      // Persist to localStorage
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
    },
    newForm: (state) => {
      state.title = 'Untitled Form';
      state.description = '';
      state.fields = [];
      state.selectedFieldId = null;
      state.currentFormId = null;
      state.isPreviewMode = false;
    },
  },
});

export const {
  setFormTitle,
  setFormDescription,
  addField,
  updateField,
  deleteField,
  reorderFields,
  duplicateField,
  setSelectedField,
  togglePreviewMode,
  clearForm,
  saveForm,
  loadForm,
  deleteForm,
  newForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
