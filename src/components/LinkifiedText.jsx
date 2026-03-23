import { Link } from '@mui/material';

const urlRegex = /(https?:\/\/[^\s]+)/g;

const LinkifiedText = ({ text, ...typographyProps }) => {
  if (!text) return null;

  const parts = text.split(urlRegex);

  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <Link
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ wordBreak: 'break-all' }}
      >
        {part}
      </Link>
    ) : (
      part
    )
  );
};

export default LinkifiedText;
