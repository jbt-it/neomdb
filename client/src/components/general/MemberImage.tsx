import React from "react";
import { Box } from "@mui/material";

/**
 * Interface for the props of the MemberImage component
 */
interface MemberImageProps {
  base64?: string;
  mimeType?: string;
  size: string | number;
  defaultImage: string;
  alt: string;
}

/**
 * This component displays the image of a member
 * @param base64 The base64 string of the image
 * @param mimeType The mime type (e.g. jpg, png) of the image
 * @param size The size of the image
 * @param defaultImage The default image
 * @param alt The alt text of the image
 */
const MemberImage: React.FC<MemberImageProps> = ({ base64, mimeType, size, defaultImage, alt }) => {
  return (
    <Box
      component="img"
      src={base64 ? `data:image/${mimeType};base64,${base64}` : defaultImage}
      alt={alt}
      sx={{
        backgroundColor: "white",
        borderRadius: "50%",
        border: "3px solid var(--white,#fff)",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        marginLeft: "20px",
        marginTop: "20px",
        width: size,
        height: size,
        objectFit: "cover",
      }}
    />
  );
};

export default MemberImage;
