import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  TextFields,
  Email,
  Numbers,
  Subject,
  CheckBox,
  RadioButtonChecked,
  ArrowDropDownCircle,
  DateRange,
  DragIndicator,
  Functions,
  Group,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { addField } from '../store/formBuilderSlice';
import type { FormField } from '../store/formBuilderSlice';

const fieldTypes = [
  {
    type: 'text' as const,
    label: 'Text Input',
    icon: <TextFields />,
    description: 'Single line text input',
  },
  {
    type: 'email' as const,
    label: 'Email',
    icon: <Email />,
    description: 'Email address input',
  },
  {
    type: 'number' as const,
    label: 'Number',
    icon: <Numbers />,
    description: 'Numeric input field',
  },
  {
    type: 'textarea' as const,
    label: 'Textarea',
    icon: <Subject />,
    description: 'Multi-line text input',
  },
  {
    type: 'select' as const,
    label: 'Select',
    icon: <ArrowDropDownCircle />,
    description: 'Dropdown selection',
  },
  {
    type: 'checkbox' as const,
    label: 'Single Checkbox',
    icon: <CheckBox />,
    description: 'Boolean checkbox',
  },
  {
    type: 'radio' as const,
    label: 'Radio Group',
    icon: <RadioButtonChecked />,
    description: 'Radio button group',
  },
  {
    type: 'date' as const,
    label: 'Date',
    icon: <DateRange />,
    description: 'Date picker',
  },
  {
    type: 'derived' as const,
    label: 'Derived Field',
    icon: <Functions />,
    description: 'Computed field based on other fields',
  },
  {
    type: 'checkbox-group' as const,
    label: 'Checkbox Group',
    icon: <Group />,
    description: 'Multiple selectable options',
  },
];

interface DraggableFieldItemProps {
  fieldType: typeof fieldTypes[0];
  index: number;
  onAddField: (fieldType: FormField['type']) => void;
}

const DraggableFieldItem: React.FC<DraggableFieldItemProps> = ({ fieldType, index, onAddField }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${fieldType.type}`,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={style}
    >
      <ListItem
        sx={{
          p: 0,
          mb: 1,
          borderRadius: 2,
        }}
      >
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          onClick={() => onAddField(fieldType.type)}
          sx={{
            width: '100%',
            boxShadow: 'var(--shadow-form)',
            border: '1px solid var(--color-field-border)',
            cursor: 'grab',
            '&:hover': {
              boxShadow: '0 8px 25px -8px rgba(59, 130, 246, 0.3)',
              borderColor: 'var(--color-primary)',
              transform: 'translateY(-2px)',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            },
            '&:active': {
              cursor: 'grabbing',
            },
            transition: 'all 0.2s ease-in-out',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DragIndicator sx={{ color: 'text.secondary', fontSize: '1rem', mr: 1 }} />
              <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                {fieldType.icon}
              </ListItemIcon>
              <ListItemText
                primary={fieldType.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: '0.75rem', ml: 4 }}
            >
              {fieldType.description}
            </Typography>
          </CardContent>
        </Card>
      </ListItem>
    </motion.div>
  );
};

const FieldPalette: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddField = (fieldType: FormField['type']) => {
    const fieldTypeData = fieldTypes.find(f => f.type === fieldType);
    
    const newField = {
      type: fieldType,
      label: `${fieldTypeData?.label} Field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      // Set derived field properties
      isDerived: fieldType === 'derived',
      parentFields: fieldType === 'derived' ? [] : undefined,
      derivationFormula: fieldType === 'derived' ? '' : undefined,
      derivationType: fieldType === 'derived' ? 'custom' as const : undefined,
      // Set group properties for checkbox-group
      groupOptions: fieldType === 'checkbox-group' ? [
        { id: 'opt1', label: 'Option 1', value: 'option1' },
        { id: 'opt2', label: 'Option 2', value: 'option2' }
      ] : undefined,
    };
    
    dispatch(addField(newField));
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Field Types
        </Typography>
        <Typography variant="body2" sx={{ mb: 0, color: 'text.secondary', fontSize: '0.75rem' }}>
          Click to add or drag to form canvas
        </Typography>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        px: 2,
        pb: 2
      }}>
        <List sx={{ p: 0 }}>
          {fieldTypes.map((fieldType, index) => (
            <DraggableFieldItem
              key={fieldType.type}
              fieldType={fieldType}
              index={index}
              onAddField={handleAddField}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default FieldPalette;
