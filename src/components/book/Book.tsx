import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  author: string;
  isbn: string;
  cover: string;
}

export const Book: React.FC<Props> = ({
  title,
  author,
  isbn,
  cover,
}) => {
  const coverSrc = `https://covers.openlibrary.org/b/ID/${cover}-S.jpg?default=false`;
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={coverSrc} title={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {author}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          ISBN: {isbn}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Book;
