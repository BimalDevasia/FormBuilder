import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Save,
  FolderOpen,
  Delete,
  Add,
  Edit,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../store';
import { saveForm, loadForm, deleteForm, newForm } from '../store/formBuilderSlice';
import type { SavedForm } from '../store/formBuilderSlice';

interface FormManagerProps {
  open: boolean;
  onClose: () => void;
}

const FormManager: React.FC<FormManagerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { savedForms, currentFormId, title, fields } = useSelector((state: RootState) => state.formBuilder);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSaveForm = () => {
    dispatch(saveForm());
    onClose();
  };

  const handleLoadForm = (formId: string) => {
    dispatch(loadForm(formId));
    onClose();
  };

  const handleDeleteForm = (formId: string) => {
    dispatch(deleteForm(formId));
    setDeleteConfirmId(null);
  };

  const handleNewForm = () => {
    dispatch(newForm());
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentForm = currentFormId ? savedForms.find(f => f.id === currentFormId) : null;
  const hasUnsavedChanges = currentForm ? 
    (currentForm.title !== title || JSON.stringify(currentForm.fields) !== JSON.stringify(fields)) :
    fields.length > 0 || title !== 'Untitled Form';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '70vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600}>
            Form Manager
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleNewForm}
              size="small"
            >
              New Form
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveForm}
              size="small"
              disabled={!hasUnsavedChanges}
            >
              Save Current
              {hasUnsavedChanges && (
                <Chip 
                  label="*" 
                  size="small" 
                  color="warning" 
                  sx={{ ml: 1, minWidth: 20, height: 20 }} 
                />
              )}
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {savedForms.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            <FolderOpen sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              No Saved Forms
            </Typography>
            <Typography variant="body2">
              Save your first form to see it here
            </Typography>
          </Box>
        ) : (
          <List sx={{ pt: 0 }}>
            <AnimatePresence>
              {savedForms.map((form: SavedForm, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      border: currentFormId === form.id ? '2px solid var(--color-primary)' : '1px solid var(--color-field-border)',
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: currentFormId === form.id ? 'rgba(59, 130, 246, 0.04)' : 'background.paper',
                      '&:hover': {
                        backgroundColor: currentFormId === form.id ? 'rgba(59, 130, 246, 0.08)' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {form.title}
                          </Typography>
                          {currentFormId === form.id && (
                            <Chip label="Current" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {form.description || 'No description'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Chip 
                              label={`${form.fields.length} fields`} 
                              size="small" 
                              variant="outlined" 
                            />
                            <Typography variant="caption" color="text.secondary">
                              Updated: {formatDate(form.updatedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleLoadForm(form.id)}
                          disabled={currentFormId === form.id}
                          title="Load Form"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirmId(form.id)}
                          color="error"
                          title="Delete Form"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < savedForms.length - 1 && <Divider sx={{ my: 1 }} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        maxWidth="sm"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this form? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirmId && handleDeleteForm(deleteConfirmId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FormManager;
