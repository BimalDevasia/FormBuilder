import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  FormGroup,
  Chip,
  Stack,
} from '@mui/material';

import type { FormField } from '../store/formBuilderSlice';

interface FieldRendererProps {
  field: FormField;
  isBuilder?: boolean;
  value?: string | number | boolean | string[];
  onChange?: (value: string | number | boolean | string[]) => void;
  error?: string;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  isBuilder = false,
  value,
  onChange,
  error,
}) => {
  const fieldId = `field-${field.id}`;
  const hasError = Boolean(error);

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <TextField
            id={fieldId}
            type={field.validation?.isPassword ? 'password' : field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={isBuilder ? '' : value || ''}
            onChange={isBuilder ? undefined : (e) => onChange?.(e.target.value)}
            required={field.required}
            disabled={isBuilder}
            error={hasError}
            helperText={error}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isBuilder ? 'action.hover' : 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
            }}
          />
        );

      case 'number':
        return (
          <TextField
            id={fieldId}
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={isBuilder ? '' : value || ''}
            onChange={isBuilder ? undefined : (e) => onChange?.(Number(e.target.value))}
            required={field.required}
            disabled={isBuilder}
            error={hasError}
            helperText={error}
            fullWidth
            variant="outlined"
            inputProps={{
              min: field.validation?.min,
              max: field.validation?.max,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isBuilder ? 'action.hover' : 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
            }}
          />
        );

      case 'textarea':
        return (
          <TextField
            id={fieldId}
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            value={isBuilder ? '' : value || ''}
            onChange={isBuilder ? undefined : (e) => onChange?.(e.target.value)}
            required={field.required}
            disabled={isBuilder}
            error={hasError}
            helperText={error}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isBuilder ? 'action.hover' : 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
            }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasError}>
            <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
              {field.label}
              {field.required && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </FormLabel>
            <Select
              id={fieldId}
              value={isBuilder ? '' : value || ''}
              onChange={isBuilder ? undefined : (e) => onChange?.(e.target.value)}
              disabled={isBuilder}
              displayEmpty
              sx={{
                backgroundColor: isBuilder ? 'action.hover' : 'background.paper',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                },
              }}
            >
              <MenuItem value="" disabled>
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error.main" sx={{ mt: 0.5, ml: 1.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={hasError}>
            <FormControlLabel
              control={
                <Checkbox
                  id={fieldId}
                  checked={isBuilder ? false : Boolean(value)}
                  onChange={isBuilder ? undefined : (e) => onChange?.(e.target.checked)}
                  disabled={isBuilder}
                  sx={{
                    color: 'var(--color-primary)',
                    '&.Mui-checked': {
                      color: 'var(--color-primary)',
                    },
                  }}
                />
              }
              label={
                <Box>
                  {field.label}
                  {field.required && (
                    <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  )}
                </Box>
              }
            />
            {error && (
              <Typography variant="caption" color="error.main" sx={{ ml: 4 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={hasError}>
            <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
              {field.label}
              {field.required && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </FormLabel>
            <RadioGroup
              aria-labelledby={fieldId}
              value={isBuilder ? '' : value || ''}
              onChange={isBuilder ? undefined : (e) => onChange?.(e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  disabled={isBuilder}
                  control={
                    <Radio
                      sx={{
                        color: 'var(--color-primary)',
                        '&.Mui-checked': {
                          color: 'var(--color-primary)',
                        },
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error.main" sx={{ ml: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            id={fieldId}
            type="date"
            label={field.label}
            value={isBuilder ? '' : value || ''}
            onChange={isBuilder ? undefined : (e) => onChange?.(e.target.value)}
            required={field.required}
            disabled={isBuilder}
            error={hasError}
            helperText={error}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isBuilder ? 'action.hover' : 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
            }}
          />
        );

      case 'derived':
        // In preview mode, show as a regular readonly text field
        if (!isBuilder) {
          return (
            <TextField
              id={fieldId}
              label={field.label}
              value={value || ''}
              required={field.required}
              disabled
              error={hasError}
              helperText={error}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          );
        }
        
        // In builder mode, show as derived field with configuration info
        return (
          <Box sx={{ p: 2, border: '2px dashed #e0e0e0', borderRadius: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
              📊 {field.label} (Derived Field)
              {field.required && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
            {field.parentFields && field.parentFields.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Derived from:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {field.parentFields.map((parentId) => (
                    <Chip
                      key={parentId}
                      label={`Field ${parentId}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Typography variant="caption" color="warning.main">
                ⚠️ No parent fields selected
              </Typography>
            )}
            {field.derivationFormula && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Formula: {field.derivationFormula}
              </Typography>
            )}
            <TextField
              value="Computed value will appear here"
              disabled
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        );

      case 'checkbox-group':
        return (
          <FormControl component="fieldset" error={hasError}>
            <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
              {field.label}
              {field.required && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </FormLabel>
            <FormGroup>
              {field.groupOptions?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={isBuilder ? false : Array.isArray(value) ? value.includes(option.value) : false}
                      onChange={isBuilder ? undefined : (e) => {
                        if (!Array.isArray(value)) return;
                        const newValue = e.target.checked
                          ? [...value, option.value]
                          : value.filter(v => v !== option.value);
                        onChange?.(newValue);
                      }}
                      disabled={isBuilder}
                      sx={{
                        color: 'var(--color-primary)',
                        '&.Mui-checked': {
                          color: 'var(--color-primary)',
                        },
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error.main" sx={{ ml: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return <Box sx={{ mb: 2 }}>{renderField()}</Box>;
};

export default FieldRenderer;
