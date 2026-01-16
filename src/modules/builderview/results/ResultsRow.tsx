import { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  numberOfPages: number | undefined;
  length: number | undefined;
  rawDataDownload: () => void;
  onDelete: () => void;
};

const ResultsRow: FC<ResultData> = ({
  name,
  numberOfPages,
  length,
  rawDataDownload,
  onDelete,
}) => (
  <TableRow>
    <TableCell>{name}</TableCell>
    <TableCell>{numberOfPages}</TableCell>
    <TableCell>{length}</TableCell>
    <TableCell>
      <IconButton
        onClick={(): void => {
          rawDataDownload();
        }}
      >
        <FileDownloadIcon />
      </IconButton>
    </TableCell>
    <TableCell>
      <IconButton
        onClick={(): void => {
          if (
            // eslint-disable-next-line no-alert
            window.confirm(
              `Are you sure you want to delete results for ${name || 'this user'}?`,
            )
          ) {
            onDelete();
          }
        }}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

export default ResultsRow;
