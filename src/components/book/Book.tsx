import React, { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  author: string;
  isbn: string;
  cover: string;
  children: ReactNode;
}

export const Book: React.FC<Props> = ({
  title,
  author,
  isbn,
  cover,
  children,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {cover && <CardMedia sx={{ height: 273 }} image={cover} title={title} />}
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
      <CardActions>{children}</CardActions>
    </Card>
  );
};

export default Book;
