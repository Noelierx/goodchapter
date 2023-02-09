import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface BookProps {
  title: string;
  author: string;
  status: string;
}

const Book: React.FC<BookProps> = ({ title, author, status }) => {

  return (
    <Card sx={{minWidth: 275}}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography sx={{mb: 12}} color="textSecondary">
          {author}
        </Typography>
        <Typography variant="body2" component="p">
          Status: {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Book;