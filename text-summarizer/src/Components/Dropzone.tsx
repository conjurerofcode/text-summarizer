import { CSSProperties, useCallback, useEffect, useMemo } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

interface DropzoneProps {
  fileHandler: (file: React.DragEvent<HTMLDivElement>) => void;
}
const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: "20px",
  borderColor: "rgb(0, 0, 0, 0.75",
  borderStyle: "dashed",
  backgroundColor: "rgb(255, 255, 255, 0.5)",
  color: "white",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "100px",
  width: "350px",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
const Dropzone: React.FC<DropzoneProps> = ({ fileHandler }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    noKeyboard: true,
    noClick: true,
    accept: { "image/*": [], "text/plain": [] },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size}
    </li>
  ));

  return (
    <div
      {...getRootProps({
        style,
        onDrop: (e) => {
          fileHandler(e);
        },
      })}
    >
      <input {...getInputProps()} />

      <p>Drag a file here</p>
    </div>
  );
};

export default Dropzone;
