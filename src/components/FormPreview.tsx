import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import type { FormField, FormState } from '../store/formBuilderSlice';
import FieldRenderer from './FieldRenderer';
import { createFieldValidation } from '../utils/validation';

interface FormPreviewProps {
  formData?: FormState; // Optional prop to override the Redux state
}

const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
  const reduxFormData = useSelector((state: RootState) => state.formBuilder);
  
  // Use provided formData or fall back to Redux state
  const { title, description, fields } = formData || reduxFormData;

  // Create dynamic validation schema
  const createFormSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    fields.forEach((field: FormField) => {
      const fieldValidation = createFieldValidation(field);
      schemaFields[field.id] = fieldValidation.shape.value;
    });

    return z.object(schemaFields);
  };

  // Calculate derived field values
  const calculateDerivedValue = (field: FormField, formValues: Record<string, unknown>): string => {
    if (field.type !== 'derived' || !field.parentFields || field.parentFields.length === 0) {
      return '';
    }

    try {
      switch (field.derivationType) {
        case 'age_from_dob': {
          const dobField = field.parentFields[0];
          const dobValue = formValues[dobField];
          if (dobValue) {
            const birthDate = new Date(dobValue as string);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            return age.toString();
          }
          break;
        }
        case 'sum': {
          const sum = field.parentFields.reduce((total, parentId) => {
            const value = formValues[parentId];
            return total + (isNaN(Number(value)) ? 0 : Number(value));
          }, 0);
          return sum.toString();
        }
        case 'difference': {
          if (field.parentFields.length >= 2) {
            const val1 = Number(formValues[field.parentFields[0]]) || 0;
            const val2 = Number(formValues[field.parentFields[1]]) || 0;
            return (val1 - val2).toString();
          }
          break;
        }
        case 'custom': {
          if (field.derivationFormula) {
            let formula = field.derivationFormula;
            field.parentFields.forEach(parentId => {
              const value = formValues[parentId] || '';
              formula = formula.replace(new RegExp(`{${parentId}}`, 'g'), value.toString());
            });
            // Simple eval alternative for basic math operations
            try {
              // Only allow basic math operations for security
              if (/^[\d\s+\-*/().]+$/.test(formula)) {
                return eval(formula).toString();
              }
            } catch (e) {
              console.warn('Formula evaluation error:', e);
            }
          }
          break;
        }
      }
    } catch (error) {
      console.warn('Derived field calculation error:', error);
    }
    
    return '';
  };

  const formSchema = createFormSchema();
  
  const {
    control,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc: Record<string, unknown>, field: FormField) => {
      if (field.type === 'checkbox') {
        acc[field.id] = false;
      } else if (field.type === 'checkbox-group') {
        acc[field.id] = [];
      } else if (field.type === 'derived') {
        acc[field.id] = '';
      } else {
        acc[field.id] = '';
      }
      return acc;
    }, {}),
  });

  // Watch all form values to update derived fields
  const watchedValues = watch();

  // Calculate derived values for each derived field
  const derivedValues = fields.reduce((acc: Record<string, string>, field: FormField) => {
    if (field.type === 'derived') {
      acc[field.id] = calculateDerivedValue(field, watchedValues);
    }
    return acc;
  }, {});

  const onSubmit = (data: Record<string, unknown>) => {
    // Transform data to use field labels instead of IDs
    const transformedData: Record<string, unknown> = {};
    
    Object.entries(data).forEach(([fieldId, value]) => {
      const field = fields.find(f => f.id === fieldId);
      const fieldLabel = field?.label || fieldId;
      
      // For derived fields, use the computed value
      if (field?.type === 'derived') {
        transformedData[fieldLabel] = derivedValues[fieldId];
      } else {
        transformedData[fieldLabel] = value;
      }
    });
    
    console.group('📋 Form Submission Data');
    console.log('Form Title:', title);
    console.log('Form Description:', description);
    console.table(transformedData);
   
    
    alert(`Form "${title}" submitted successfully! Check console for detailed data.`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            backgroundColor: 'background.paper',
            border: '1px solid var(--color-field-border)',
            borderRadius: 3,
          }}
        >
          {/* Form Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {description}
              </Typography>
            )}
          </Box>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              {fields.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    No Fields Added
                  </Typography>
                  <Typography variant="body2">
                    Add some fields to your form to see the preview
                  </Typography>
                </Box>
              ) : (
                [...fields]
                  .sort((a: FormField, b: FormField) => a.order - b.order)
                  .map((field: FormField, index: number) => (
                    <motion.div
                      key={field.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField, fieldState }) => (
                          <FieldRenderer
                            field={field}
                            value={
                              field.type === 'derived' 
                                ? derivedValues[field.id] 
                                : controllerField.value as string | number | boolean | string[]
                            }
                            onChange={controllerField.onChange}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </motion.div>
                  ))
              )}
            </Box>

            {/* Submit Button */}
            {fields.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: fields.length * 0.1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'var(--shadow-form)',
                      '&:hover': {
                        boxShadow: '0 8px 25px -8px rgba(59, 130, 246, 0.4)',
                      },
                    }}
                  >
                    Submit Form
                  </Button>
                </Box>
              </motion.div>
            )}
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default FormPreview;
