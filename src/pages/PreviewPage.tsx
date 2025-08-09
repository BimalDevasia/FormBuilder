import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Box, Button } from '@mui/material';
import { Create } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import FormPreview from '../components/FormPreview';
import { useEffect, useState } from 'react';
import type { SavedForm } from '../store/formBuilderSlice';

const PreviewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  
  const currentForm = useSelector((state: RootState) => state.formBuilder);
  const [previewForm, setPreviewForm] = useState(currentForm);

  useEffect(() => {
    if (formId) {
      // Load specific form from localStorage
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]') as SavedForm[];
      const form = savedForms.find((f: SavedForm) => f.id === formId);
      if (form) {
        setPreviewForm({
          title: form.title,
          description: form.description,
          fields: form.fields,
          isPreviewMode: true,
          selectedFieldId: null,
          savedForms: [],
          currentFormId: form.id
        });
      }
    } else {
      // Use current form from Redux store
      setPreviewForm(currentForm);
    }
  }, [formId, currentForm]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {previewForm.fields.length > 0 ? (
            <FormPreview formData={previewForm} />
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                color: 'text.secondary'
              }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">
                No Form to Preview
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-poppins">
                Create a form first to see the preview
              </p>
              <Button
                variant="contained"
                startIcon={<Create />}
                onClick={() => navigate('/create')}
                sx={{ fontFamily: 'Poppins' }}
              >
                Create New Form
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PreviewPage;
