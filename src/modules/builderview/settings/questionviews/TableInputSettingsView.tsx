import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { TableInput } from '@/modules/config/AppSettings';

type TableInputSettingsViewProps = {
  questionObject: TableInput;
  onChange: (question: TableInput) => void;
};

const TableInputSettingsView: FC<TableInputSettingsViewProps> = ({
  questionObject,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { question, description, columns, mandatory, minRows, maxRows } =
    questionObject;

  const columnFields = columns.map((column, index) => (
    <Box
      key={index}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-start',
        mt: 1.5,
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        backgroundColor: '#f8f9fa',
      }}
    >
      <Stack spacing={1} sx={{ flex: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={column.label}
          label="Column Label"
          onChange={(e) =>
            onChange({
              ...questionObject,
              columns: questionObject.columns.map((col, i) =>
                i === index ? { ...col, label: e.target.value } : col,
              ),
            })
          }
        />
        <TextField
          fullWidth
          size="small"
          value={column.name}
          label="Column Name (ID)"
          placeholder="e.g., commercialName"
          onChange={(e) =>
            onChange({
              ...questionObject,
              columns: questionObject.columns.map((col, i) =>
                i === index ? { ...col, name: e.target.value } : col,
              ),
            })
          }
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Select
            size="small"
            value={column.inputType}
            onChange={(e) =>
              onChange({
                ...questionObject,
                columns: questionObject.columns.map((col, i) =>
                  i === index
                    ? {
                        ...col,
                        inputType: e.target.value as 'text' | 'number' | 'date',
                      }
                    : col,
                ),
              })
            }
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
          <FormControlLabel
            control={<Switch size="small" />}
            label="Required"
            onChange={(e, checked) =>
              onChange({
                ...questionObject,
                columns: questionObject.columns.map((col, i) =>
                  i === index ? { ...col, required: checked } : col,
                ),
              })
            }
            checked={column.required}
          />
        </Box>
      </Stack>
      <IconButton
        onClick={() =>
          onChange({
            ...questionObject,
            columns: questionObject.columns.filter((_, i) => i !== index),
          })
        }
        disabled={columns.length <= 1}
        size="small"
        color="error"
        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ));

  const handleAddNewColumn = (): void => {
    onChange({
      ...questionObject,
      columns: [
        ...columns,
        { name: '', label: '', inputType: 'text', required: false },
      ],
    });
  };

  return (
    <Stack spacing={2}>
      <TextField
        value={question}
        label={t('QUESTION_LABEL')}
        onChange={(e) =>
          onChange({ ...questionObject, question: e.target.value })
        }
      />
      <TextField
        value={description}
        label={t('DESCRIPTION_LABEL')}
        onChange={(e) =>
          onChange({ ...questionObject, description: e.target.value })
        }
      />
      <FormControlLabel
        control={<Switch />}
        label={t('MANDATORY_LABEL')}
        onChange={(e, checked) =>
          onChange({ ...questionObject, mandatory: checked })
        }
        checked={mandatory}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Table Columns:
        </Typography>
        {columnFields}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleAddNewColumn} size="small">
            Add Column
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          type="number"
          value={minRows}
          label="Minimum Rows"
          onChange={(e) =>
            onChange({
              ...questionObject,
              minRows: parseInt(e.target.value, 10) || 1,
            })
          }
          inputProps={{ min: 1 }}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          value={maxRows}
          label="Maximum Rows"
          onChange={(e) =>
            onChange({
              ...questionObject,
              maxRows: parseInt(e.target.value, 10) || 10,
            })
          }
          inputProps={{ min: minRows }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
};

export default TableInputSettingsView;
