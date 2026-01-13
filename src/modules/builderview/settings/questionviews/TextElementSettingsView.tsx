import { FC } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactQuill from 'react-quill';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-quill/dist/quill.snow.css';

import { Box, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

// Import Quill styles
import { TextElement } from '@/modules/config/AppSettings';

type TextElementSettingsViewProps = {
  textElement: TextElement;
  onChange: (element: TextElement) => void;
};

const TextElementSettingsView: FC<TextElementSettingsViewProps> = ({
  textElement,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.SECTIONS',
  });
  const { title, description, continueButtonText } = textElement;

  return (
    <Stack spacing={2}>
      <TextField
        value={title}
        label={t('TITLE_LABEL')} // Assuming you want to use the same label here
        onChange={(e) => onChange({ ...textElement, title: e.target.value })}
      />
      <Stack spacing={2}>
        <Typography variant="body2" component="label" color="textSecondary">
          {t('DESCRIPTION_LABEL')}
        </Typography>
        <Box
          sx={{
            '.ql-editor': {
              minHeight: '150px',
              fontSize: '1rem',
              color: 'text.primary',
              padding: '10px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '4px',
            },
          }}
        >
          <ReactQuill
            value={description}
            onChange={(value) =>
              onChange({ ...textElement, description: value })
            }
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
              ],
            }}
          />
        </Box>
      </Stack>
      <TextField
        value={continueButtonText}
        label={t('CONTINUE_BUTTON_TEXT_LABEL')} // Assuming you want to use the same label here
        onChange={(e) =>
          onChange({ ...textElement, continueButtonText: e.target.value })
        }
      />
    </Stack>
  );
};

export default TextElementSettingsView;
