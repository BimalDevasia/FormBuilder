import React from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  DragIndicator,
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import { deleteField, duplicateField, setSelectedField } from '../store/formBuilderSlice';
import type { FormField as FormFieldType } from '../store/formBuilderSlice';
import FieldRenderer from './FieldRenderer';

interface FormFieldProps {
  field: FormFieldType;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const dispatch = useDispatch();
  const selectedFieldId = useSelector((state: RootState) => state.formBuilder.selectedFieldId);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isSelected = selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFieldSelect = () => {
    dispatch(setSelectedField(field.id));
  };

  const handleEdit = () => {
    dispatch(setSelectedField(field.id));
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(deleteField(field.id));
    handleMenuClose();
  };

  const handleDuplicate = () => {
    dispatch(duplicateField(field.id));
    handleMenuClose();
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        {...attributes}
        elevation={isDragging ? 8 : 0}
        onClick={handleFieldSelect}
        sx={{
          mb: 2,
          p: 2,
          cursor: 'pointer',
          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-field-border)',
          borderRadius: 2,
          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.02)' : 'background.paper',
          position: 'relative',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            boxShadow: 'var(--shadow-form)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {/* Drag Handle */}
        <Box
          {...listeners}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'grab',
            color: 'text.secondary',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <DragIndicator fontSize="small" />
        </Box>

        {/* Field Content */}
        <Box sx={{ ml: 4, mr: 4 }}>
          <FieldRenderer field={field} isBuilder />
        </Box>

        {/* Actions Menu */}
        <Box
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Tooltip title="Field options">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                opacity: isSelected ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
         
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Field</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDuplicate}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </motion.div>
  );
};

export default FormField;
