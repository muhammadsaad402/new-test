import React, { useRef, useCallback, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Typography } from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styles from "./DragNDrop.module.css";

const DragNDrop = ({ textSize, dimensions, pdf, images, setImageSrc, getFile }) => {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    setImageSrc(URL.createObjectURL(file));
    getFile(file);
  };

  // console.log("file upload", file);

  return (
    <div className={styles.dndBox}>
      <FileUploader handleChange={handleChange} name="file">
        {pdf && (
          <div className={styles.dragBox}>
            <Typography variant={textSize && "h5"}>
              Drag and drop a file here or click
            </Typography>
            <CloudUploadIcon
              sx={{ color: "var(--iconGreyColor)", fontSize: "60px" }}
            />
          </div>
        )}
        {images && (
          <div className={styles.dragBox}>
            <CloudUploadIcon
              sx={{ color: "var(--iconGreyColor)", fontSize: "60px" }}
            />
            <Typography variant={textSize && "h5"} sx={{ my: "8px" }}>
              Drag and drop a file here or click
            </Typography>
            <Typography variant={textSize && "h5"} sx={{ my: "8px" }}>
              Please upload .jpg, .png format with {dimensions && `height ${dimensions.height} and width ${dimensions.width}`}
            </Typography>
            <Typography variant={textSize && "h5"} sx={{ my: "8px" }}>
              Max size 5 mb
            </Typography>
          </div>
        )}
      </FileUploader>
    </div>
  );
};

export default DragNDrop;
