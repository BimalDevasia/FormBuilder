import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Container,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Preview,
  Delete,
  MoreVert,
  Add,
  Create
} from '@mui/icons-material';
import type { SavedForm } from '../store/formBuilderSlice';
import { useDispatch } from 'react-redux';
import { loadForm } from '../store/formBuilderSlice';

const MyFormsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load saved forms from localStorage
    const forms = JSON.parse(localStorage.getItem('savedForms') || '[]') as SavedForm[];
    setSavedForms(forms.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const handleDeleteForm = (formId: string) => {
    const updatedForms = savedForms.filter(form => form.id !== formId);
    setSavedForms(updatedForms);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const handleEditForm = (form: SavedForm) => {
    dispatch(loadForm(form.id));
    navigate('/create');
  };

  const handlePreviewForm = (formId: string) => {
    navigate(`/preview?formId=${formId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFieldTypeCount = (form: SavedForm) => {
    const types = form.fields.reduce((acc, field) => {
      acc[field.type] = (acc[field.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(types).slice(0, 3).map(([type, count]) => 
      `${count} ${type}${count > 1 ? 's' : ''}`
    ).join(', ');
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {savedForms.length === 0 ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ color: 'text.secondary' }}>
                <Create sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
                <h1 className="text-4xl font-semibold text-gray-900 mb-4 font-poppins">
                  No Forms Yet
                </h1>
                <p className="text-lg text-gray-600 mb-8 font-poppins">
                  Start creating your first form to see it here
                </p>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate('/create')}
                  sx={{ 
                    fontFamily: 'Poppins',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Create Your First Form
                </Button>
              </Box>
            </Paper>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 3 }
              }}
            >
              {savedForms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card 
                      elevation={3}
                      onClick={() => handlePreviewForm(form.id)}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        },
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <h3 className="text-base sm:text-lg font-semibold text-blue-600 font-poppins break-words">
                            {form.title || 'Untitled Form'}
                          </h3>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormToDelete(form.id);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ color: 'text.secondary' }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                        
                        {form.description && (
                          <p className="text-sm text-gray-600 font-poppins mb-4 line-clamp-2">
                            {form.description}
                          </p>
                        )}

                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ 
                              mr: 1, 
                              mb: 1,
                              fontFamily: 'Poppins',
                              bgcolor: 'primary.50',
                              color: 'primary.main'
                            }}
                          />
                          {form.fields.length > 0 && (
                            <small className="text-xs text-gray-500 font-poppins block mt-2">
                              {getFieldTypeCount(form)}
                            </small>
                          )}
                        </Box>

                        <small className="text-xs text-gray-500 font-poppins block">
                          Created: {formatDate(form.createdAt)}
                        </small>
                        <small className="text-xs text-gray-500 font-poppins block">
                          Updated: {formatDate(form.updatedAt)}
                        </small>
                      </CardContent>
                      
                      <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0, gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Preview />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewForm(form.id);
                          }}
                          sx={{ 
                            fontFamily: 'Poppins',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Preview
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Create />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditForm(form);
                          }}
                          sx={{ 
                            fontFamily: 'Poppins',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Edit
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormToDelete(form.id);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ ml: 'auto', color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
              ))}
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Floating Create Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/create')}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1.5,
            fontFamily: 'Poppins',
            fontWeight: 600,
            boxShadow: 4,
            '&:hover': {
              boxShadow: 8,
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Create Form
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'Poppins' }}>
          Delete Form
        </DialogTitle>
        <DialogContent>
          <p className="font-poppins">
            Are you sure you want to delete this form? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontFamily: 'Poppins' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => formToDelete && handleDeleteForm(formToDelete)}
            color="error"
            variant="contained"
            sx={{ fontFamily: 'Poppins' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyFormsPage;
