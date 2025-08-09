import React from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material';
import { Save, Add } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import type { RootState } from '../store';
import { setFormTitle, setFormDescription, saveForm, newForm, type FormField as FormFieldType } from '../store/formBuilderSlice';
import FormField from './FormField';

const FormCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const { title, description, fields, currentFormId } = useSelector((state: RootState) => state.formBuilder);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormTitle(event.target.value));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormDescription(event.target.value));
  };

  const handleSaveForm = () => {
    if (fields.length === 0) {
      alert('Please add some fields before saving the form.');
      return;
    }
    
    if (!title.trim()) {
      alert('Please add a form title before saving.');
      return;
    }
    
    dispatch(saveForm());
    
    // Show success message
    const message = currentFormId ? 'Form updated successfully!' : 'Form saved successfully!';
    alert(message);
  };

  const handleCreateNewForm = () => {
    if (fields.length > 0 || title.trim() || description.trim()) {
      const confirm = window.confirm('Are you sure you want to create a new form? Any unsaved changes will be lost.');
      if (!confirm) return;
    }
    dispatch(newForm());
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto', backgroundColor: 'background.default' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            backgroundColor: 'background.paper',
            border: '1px solid var(--color-field-border)',
            borderRadius: 3,
          }}
        >
          {/* Form Header */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Form Title"
              value={title}
              onChange={handleTitleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-input': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  padding: '12px 16px',
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Form description (optional)"
              value={description}
              onChange={handleDescriptionChange}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
              }}
            />
          </Box>

          {/* Form Fields */}
          <FormFieldsDropArea fields={fields} />
          
          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleCreateNewForm}
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.50',
                  borderColor: 'primary.dark',
                },
              }}
            >
              Create New Form
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveForm}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'var(--shadow-form)',
                backgroundColor: 'primary.main',
                '&:hover': {
                  boxShadow: '0 8px 25px -8px rgba(59, 130, 246, 0.4)',
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {currentFormId ? 'Update Form' : 'Save Form'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

const FormFieldsDropArea: React.FC<{ fields: FormFieldType[] }> = ({ fields }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <Box 
      ref={setNodeRef}
      sx={{ 
        minHeight: '400px',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
        border: isOver ? '2px dashed var(--color-primary)' : '2px dashed transparent',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <AnimatePresence>
        {fields.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Start Building Your Form
              </Typography>
              <Typography variant="body2">
                Drag field types from the left panel to add them to your form
              </Typography>
            </Box>
          </motion.div>
        ) : (
          [...fields]
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <motion.div
                key={field.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <FormField field={field} />
              </motion.div>
            ))
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FormCanvas;
