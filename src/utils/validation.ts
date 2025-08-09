import { z } from 'zod';
import type { FormField } from '../store/formBuilderSlice';

// Field validation schemas
export const createTextFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'This field is required') : z.string(),
});

export const createEmailFieldSchema = (required: boolean) => z.object({
  value: required 
    ? z.string().min(1, 'This field is required').email('Please enter a valid email address')
    : z.string().email('Please enter a valid email address').or(z.string().max(0)),
});

export const createNumberFieldSchema = (required: boolean) => z.object({
  value: required 
    ? z.coerce.number().min(0, 'Please enter a valid number')
    : z.coerce.number().optional().or(z.literal('')),
});

export const createTextareaFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'This field is required') : z.string(),
});

export const createSelectFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'Please select an option') : z.string(),
});

export const createCheckboxFieldSchema = (required: boolean) => z.object({
  value: required ? z.boolean().refine(val => val === true, 'This field is required') : z.boolean(),
});

export const createRadioFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'Please select an option') : z.string(),
});

export const createDateFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'Please select a date') : z.string(),
});

export const createDerivedFieldSchema = (required: boolean) => z.object({
  value: required ? z.string().min(1, 'This field is required') : z.string(),
});

// Dynamic form validation
export const createFieldValidation = (field: FormField) => {
  let schema;
  
  switch (field.type) {
    case 'email':
      schema = createEmailFieldSchema(field.required);
      break;
    case 'number':
      schema = createNumberFieldSchema(field.required);
      break;
    case 'textarea':
      schema = createTextareaFieldSchema(field.required);
      break;
    case 'select':
      schema = createSelectFieldSchema(field.required);
      break;
    case 'checkbox':
      schema = createCheckboxFieldSchema(field.required);
      break;
    case 'radio':
      schema = createRadioFieldSchema(field.required);
      break;
    case 'date':
      schema = createDateFieldSchema(field.required);
      break;
    case 'derived':
      schema = createDerivedFieldSchema(field.required);
      break;
    case 'checkbox-group':
      schema = z.object({
        value: field.required 
          ? z.array(z.string()).min(1, 'Please select at least one option')
          : z.array(z.string()),
      });
      break;
    default:
      schema = createTextFieldSchema(field.required);
  }

  // Add custom validation rules for text and textarea fields
  if (field.validation && (field.type === 'text' || field.type === 'textarea')) {
    let textSchema = field.required ? z.string().min(1, 'This field is required') : z.string();
    
    if (field.validation.minLength) {
      textSchema = textSchema.min(field.validation.minLength, `Minimum ${field.validation.minLength} characters required`);
    }
    
    if (field.validation.maxLength) {
      textSchema = textSchema.max(field.validation.maxLength, `Maximum ${field.validation.maxLength} characters allowed`);
    }
    
    if (field.validation.pattern) {
      textSchema = textSchema.regex(new RegExp(field.validation.pattern), 'Invalid format');
    }

    // Password validation
    if (field.validation.isPassword) {
      // Enforce minimum 8 characters for password fields
      textSchema = textSchema.min(8, 'Password must be at least 8 characters long');
      
      if (field.validation.requireNumber) {
        textSchema = textSchema.regex(/(?=.*\d)/, 'Password must contain at least one number');
      }
      if (field.validation.requireUppercase) {
        textSchema = textSchema.regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter');
      }
      if (field.validation.requireLowercase) {
        textSchema = textSchema.regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter');
      }
      if (field.validation.requireSpecialChar) {
        textSchema = textSchema.regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Password must contain at least one special character');
      }
    }
    
    schema = z.object({ value: textSchema });
  }
  
  // Add custom validation rules for number fields
  if (field.validation && field.type === 'number') {
    let numberSchema = field.required 
      ? z.coerce.number().min(0, 'Please enter a valid number')
      : z.coerce.number().optional().or(z.literal(''));
    
    if (field.validation.min !== undefined) {
      numberSchema = z.coerce.number().min(field.validation.min, `Minimum value is ${field.validation.min}`);
    }
    
    if (field.validation.max !== undefined) {
      numberSchema = z.coerce.number().max(field.validation.max, `Maximum value is ${field.validation.max}`);
    }
    
    schema = z.object({ value: numberSchema });
  }

  return schema;
};