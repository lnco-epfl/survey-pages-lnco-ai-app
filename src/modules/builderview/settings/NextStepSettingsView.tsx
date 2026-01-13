import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { NextStepSettings } from '@/modules/config/AppSettings';

type NextStepSettingsViewProps = {
  nextStepSettings: NextStepSettings;
  onChange: (newSetting: NextStepSettings) => void;
};

const NextStepSettingsView: FC<NextStepSettingsViewProps> = ({
  nextStepSettings,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.NEXT_STEP',
  });
  const { linkToNextPage, title, description, link, linkText } =
    nextStepSettings || {
      linkToNextPage: false,
      title: '',
      description: '',
      link: '',
      linkText: '',
    };
  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Switch />}
        label={t('LABEL_NEXT_STEP')}
        onChange={(e, checked) =>
          onChange({ ...nextStepSettings, linkToNextPage: checked })
        }
        checked={linkToNextPage}
      />
      {linkToNextPage && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{t('LINK_PAGE_LABEL')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <TextField
                value={title}
                label={t('TITLE_LABEL')}
                onChange={(e) =>
                  onChange({ ...nextStepSettings, title: e.target.value })
                }
              />
              <ReactQuill
                value={description}
                onChange={(value) =>
                  onChange({ ...nextStepSettings, description: value })
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
              <TextField
                value={link}
                label={t('LINK_LABEL')}
                onChange={(e) =>
                  onChange({ ...nextStepSettings, link: e.target.value })
                }
              />
              <TextField
                value={linkText}
                label={t('LINK_TEXT_LABEL')}
                onChange={(e) =>
                  onChange({ ...nextStepSettings, linkText: e.target.value })
                }
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

export default NextStepSettingsView;
