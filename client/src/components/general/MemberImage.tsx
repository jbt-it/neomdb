import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

/**
 * Interface for the props of the MemberImage component
 */
interface MemberImageProps {
  base64?: string;
  mimeType?: string;
  size: string | number;
  defaultImage: string;
  alt: string;
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * This component displays the image of a member with an upload icon on hover
 * @param base64 The base64 string of the image
 * @param mimeType The mime type (e.g. jpg, png) of the image
 * @param size The size of the image
 * @param defaultImage The default image
 * @param alt The alt text of the image
 * @param onImageChange Callback function when a new image is selected (if not set, the upload icon will not be displayed)
 */
const MemberImage: React.FC<MemberImageProps> = ({ base64, mimeType, size, defaultImage, alt, onImageChange }) => {
  const [hover, setHover] = useState(false);
  /**
   * Reference to the file input element used to propagate the click event
   */
  const inputFileRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the mouse enter event of the image
   * Sets the hover state to true
   */
  const handleMouseEnter = () => {
    if (onImageChange) {
      setHover(true);
    }
  };

  /**
   * Handles the mouse leave event of the image
   * Sets the hover state to false
   */
  const handleMouseLeave = () => {
    if (onImageChange) {
      setHover(false);
    }
  };

  /**
   * Handles the click on the upload icon button
   * such that the file input is clicked and the explorer is opened.
   *
   * -> This is necessary because the file input is hidden and cannot be clicked directly
   * and positioning the file input inside the icon button is not compatible with all browsers
   */
  const handleIconButtonClick = () => {
    inputFileRef.current?.click();
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      position="relative"
      sx={{
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        marginLeft: "20px",
        marginTop: "20px",
        border: "3px solid var(--white,#fff)",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <Box
        component="img"
        src={base64 ? `data:image/${mimeType};base64,${base64}` : defaultImage}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          transition: "0.3s",
          filter: hover ? "brightness(50%)" : "none",
        }}
      />
      <input ref={inputFileRef} type="file" hidden onChange={onImageChange} accept="image/*" />
      {hover ? (
        <>
          <IconButton
            color="secondary"
            onClick={handleIconButtonClick}
            sx={{
              position: "absolute",
            }}
          >
            <CloudUploadIcon fontSize="large" />
          </IconButton>
        </>
      ) : null}
    </Box>
  );
};

export default MemberImage;
