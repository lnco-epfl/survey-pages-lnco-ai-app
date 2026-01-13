import { FC } from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  numberOfPages: number | undefined;
  length: number | undefined;
  rawDataDownload: () => void;
};

const ResultsRow: FC<ResultData> = ({
  name,
  numberOfPages,
  length,
  rawDataDownload,
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
  </TableRow>
);

export default ResultsRow;
