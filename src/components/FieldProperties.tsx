import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import { ExpandMore, Add, Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import { updateField } from '../store/formBuilderSlice';
import type { FormField } from '../store/formBuilderSlice';

const FieldProperties: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedFieldId, fields } = useSelector((state: RootState) => state.formBuilder);
  
  const selectedField = fields.find((field: FormField) => field.id === selectedFieldId);

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    if (selectedFieldId) {
      dispatch(updateField({ id: selectedFieldId, updates }));
    }
  };

  const handleAddOption = () => {
    if (selectedField?.options) {
      const newOptions = [...selectedField.options, `Option ${selectedField.options.length + 1}`];
      handleFieldUpdate({ options: newOptions });
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (selectedField?.options) {
      const newOptions = [...selectedField.options];
      newOptions[index] = value;
      handleFieldUpdate({ options: newOptions });
    }
  };

  const handleDeleteOption = (index: number) => {
    if (selectedField?.options && selectedField.options.length > 1) {
      const newOptions = selectedField.options.filter((_: string, i: number) => i !== index);
      handleFieldUpdate({ options: newOptions });
    }
  };

  if (!selectedField) {
    return (
      <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-gray-500">
            <h6 className="text-lg font-medium mb-2 font-poppins">
              Field Properties
            </h6>
            <p className="text-sm font-poppins">
              Select a field to edit its properties
            </p>
          </div>
        </motion.div>
      </Box>
    );
  }

  const showOptions = selectedField.type === 'select' || selectedField.type === 'radio';
  const showValidation = ['text', 'textarea', 'number', 'email'].includes(selectedField.type);

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 }, 
      height: '100%', 
      overflow: 'auto',
      '-webkit-overflow-scrolling': 'touch',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
      }
    }}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ paddingBottom: '2rem' }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">
          Field Properties
        </h2>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)}
            color="primary"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Basic Properties */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <span className="text-sm font-semibold text-gray-800 font-poppins">
              Basic Settings
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Label"
                value={selectedField.label}
                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                size="small"
                fullWidth
              />
              
              {selectedField.type !== 'checkbox' && selectedField.type !== 'derived' && selectedField.type !== 'checkbox-group' && (
                <TextField
                  label="Placeholder"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                  size="small"
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedField.required}
                    onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                    color="primary"
                  />
                }
                label="Required field"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Options */}
        {showOptions && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <span className="text-sm font-semibold text-gray-800 font-poppins">
                Options
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {selectedField.options?.map((option: string, index: number) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      value={option}
                      onChange={(e) => handleUpdateOption(index, e.target.value)}
                      size="small"
                      fullWidth
                      placeholder={`Option ${index + 1}`}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteOption(index)}
                      disabled={selectedField.options!.length <= 1}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={handleAddOption}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Option
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Validation */}
        {showValidation && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <span className="text-sm font-semibold text-gray-800 font-poppins">
                Validation
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
                  <>
                    <TextField
                      label="Minimum Length"
                      type="number"
                      value={selectedField.validation?.minLength || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          minLength: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Maximum Length"
                      type="number"
                      value={selectedField.validation?.maxLength || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          maxLength: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Pattern (Regex)"
                      value={selectedField.validation?.pattern || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          pattern: e.target.value || undefined
                        }
                      })}
                      size="small"
                      fullWidth
                      placeholder="^[A-Za-z]+$"
                    />
                  </>
                )}

                {selectedField.type === 'number' && (
                  <>
                    <TextField
                      label="Minimum Value"
                      type="number"
                      value={selectedField.validation?.min ?? ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          min: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      label="Maximum Value"
                      type="number"
                      value={selectedField.validation?.max ?? ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          max: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                      size="small"
                      fullWidth
                    />
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Password Validation */}
        {selectedField.type === 'text' && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <span className="text-sm font-semibold text-gray-800 font-poppins">
                Password Validation
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedField.validation?.isPassword || false}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          isPassword: e.target.checked,
                          // Auto-enable require number when password validation is enabled
                          requireNumber: e.target.checked ? true : selectedField.validation?.requireNumber
                        }
                      })}
                    />
                  }
                  label="Enable Password Validation (min. 8 characters)"
                />
                
                {selectedField.validation?.isPassword && (
                  <>
                    <div className="text-xs text-gray-500 font-poppins mb-2">
                      Password fields automatically require minimum 8 characters. Configure additional requirements below:
                    </div>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedField.validation?.requireNumber || false}
                          onChange={(e) => handleFieldUpdate({
                            validation: {
                              ...selectedField.validation,
                              requireNumber: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Require at least one number (recommended)"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedField.validation?.requireUppercase || false}
                          onChange={(e) => handleFieldUpdate({
                            validation: {
                              ...selectedField.validation,
                              requireUppercase: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Require uppercase letter"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedField.validation?.requireLowercase || false}
                          onChange={(e) => handleFieldUpdate({
                            validation: {
                              ...selectedField.validation,
                              requireLowercase: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Require lowercase letter"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedField.validation?.requireSpecialChar || false}
                          onChange={(e) => handleFieldUpdate({
                            validation: {
                              ...selectedField.validation,
                              requireSpecialChar: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Require special character"
                    />
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Derived Field Configuration */}
        {selectedField.type === 'derived' && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <span className="text-sm font-semibold text-gray-800 font-poppins">
                Derived Field Configuration
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Derivation Type</InputLabel>
                  <Select
                    value={selectedField.derivationType || 'custom'}
                    onChange={(e) => handleFieldUpdate({ 
                      derivationType: e.target.value as FormField['derivationType']
                    })}
                    label="Derivation Type"
                  >
                    <MenuItem value="age_from_dob">Age from Date of Birth</MenuItem>
                    <MenuItem value="sum">Sum of Fields</MenuItem>
                    <MenuItem value="difference">Difference of Fields</MenuItem>
                    <MenuItem value="custom">Custom Formula</MenuItem>
                  </Select>
                </FormControl>

                <Autocomplete
                  multiple
                  options={fields.filter(f => f.id !== selectedField.id && f.type !== 'derived')}
                  getOptionLabel={(field) => field.label}
                  value={fields.filter(f => selectedField.parentFields?.includes(f.id))}
                  onChange={(_, newValue) => {
                    handleFieldUpdate({ 
                      parentFields: newValue.map(f => f.id)
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Parent Fields"
                      placeholder="Select fields to derive from"
                      size="small"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.label}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
                {(selectedField.derivationType === 'custom' || !selectedField.derivationType) && (
                  <TextField
                    label="Derivation Formula"
                    multiline
                    rows={3}
                    value={selectedField.derivationFormula || ''}
                    onChange={(e) => handleFieldUpdate({ derivationFormula: e.target.value })}
                    size="small"
                    fullWidth
                    placeholder="e.g., {field1} + {field2} or new Date().getFullYear() - new Date({dateField}).getFullYear()"
                    helperText="Use {fieldId} to reference parent fields"
                  />
                )}
                
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Checkbox Group Options */}
        {selectedField.type === 'checkbox-group' && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <span className="text-sm font-semibold text-gray-800 font-poppins">
                Checkbox Options
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {selectedField.groupOptions?.map((option, index) => (
                  <Box key={option.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label="Label"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...(selectedField.groupOptions || [])];
                        newOptions[index] = { ...option, label: e.target.value };
                        handleFieldUpdate({ groupOptions: newOptions });
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Value"
                      value={option.value}
                      onChange={(e) => {
                        const newOptions = [...(selectedField.groupOptions || [])];
                        newOptions[index] = { ...option, value: e.target.value };
                        handleFieldUpdate({ groupOptions: newOptions });
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={() => {
                        const newOptions = (selectedField.groupOptions || []).filter((_, i) => i !== index);
                        handleFieldUpdate({ groupOptions: newOptions });
                      }}
                      size="small"
                      color="error"
                      disabled={(selectedField.groupOptions?.length || 0) <= 1}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                
                <Button
                  startIcon={<Add />}
                  onClick={() => {
                    const newOption = {
                      id: `opt_${Date.now()}`,
                      label: `Option ${(selectedField.groupOptions?.length || 0) + 1}`,
                      value: `option${(selectedField.groupOptions?.length || 0) + 1}`
                    };
                    const newOptions = [...(selectedField.groupOptions || []), newOption];
                    handleFieldUpdate({ groupOptions: newOptions });
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Add Option
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </motion.div>
    </Box>
  );
};

export default FieldProperties;
