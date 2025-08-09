import React, { useState } from 'react';
import { Box, Paper, Fab, Drawer, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import { reorderFields, addField } from '../store/formBuilderSlice';
import type { FormField } from '../store/formBuilderSlice';
import FieldPalette from './FieldPalette';
import FormCanvas from './FormCanvas';
import FieldProperties from './FieldProperties';
import FormManager from './FormManager';
import type { DragEndEvent } from '@dnd-kit/core';

const FormBuilderLayout: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [formManagerOpen, setFormManagerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { fields, selectedFieldId } = useSelector((state: RootState) => state.formBuilder);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 50,
        tolerance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if we're dropping a new field from palette
    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.id.toString().replace('palette-', '') as FormField['type'];
      const newField = {
        type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        placeholder: '',
        required: false,
        options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      };
      dispatch(addField(newField));
      return;
    }

    // Handle reordering existing fields
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field: FormField) => field.id === active.id);
      const newIndex = fields.findIndex((field: FormField) => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedFields = arrayMove(fields as FormField[], oldIndex, newIndex);
        dispatch(reorderFields(reorderedFields));
      }
    }
  };



  // Field Palette Content Component
  const FieldPaletteContent = () => (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <FieldPalette />
    </Paper>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
        
        {/* Mobile Fab Button */}
        {isMobile && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              top: 80,
              left: 16,
              zIndex: 1300,
              boxShadow: 4,
            }}
            onClick={() => setMobileDrawerOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={isMobile && mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280,
              borderRadius: '0 16px 16px 0',
              border: 'none',
              boxShadow: 4,
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">
              Field Types
            </h3>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
            <FieldPaletteContent />
          </Box>
        </Drawer>

        <Box sx={{ 
          display: 'flex', 
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          {/* Desktop Field Palette */}
          <Box sx={{ 
            width: '280px', 
            minWidth: '280px',
            borderRight: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
          }}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <FieldPaletteContent />
            </motion.div>
          </Box>

          <Box sx={{ 
            flex: 1, 
            height: '100%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <SortableContext items={fields.map((f: FormField) => f.id)} strategy={verticalListSortingStrategy}>
                <FormCanvas />
              </SortableContext>
            </motion.div>
          </Box>

          {/* Field Properties */}
          <Box sx={{ 
            width: { xs: '100%', lg: '280px' }, 
            height: { xs: '60vh', lg: '100%' },
            minWidth: { lg: '280px' },
            borderLeft: { lg: '1px solid #e2e8f0' },
            borderTop: { xs: '1px solid #e2e8f0', lg: 'none' },
            display: { xs: selectedFieldId ? 'block' : 'none', lg: 'block' },
            position: { xs: 'fixed', lg: 'static' },
            bottom: { xs: 0, lg: 'auto' },
            left: { xs: 0, lg: 'auto' },
            right: { xs: 0, lg: 'auto' },
            backgroundColor: 'background.paper',
            zIndex: { xs: 1200, lg: 'auto' },
            boxShadow: { xs: '0 -4px 16px rgba(0,0,0,0.1)', lg: 'none' },
            borderRadius: { xs: '16px 16px 0 0', lg: 0 }
          }}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: { xs: '16px 16px 0 0', lg: 0 },
                  backgroundColor: 'background.paper',
                }}
              >
                <FieldProperties />
              </Paper>
            </motion.div>
          </Box>
        </Box>

        <FormManager 
          open={formManagerOpen} 
          onClose={() => setFormManagerOpen(false)} 
        />
      </Box>
    </DndContext>
  );
};

export default FormBuilderLayout;
