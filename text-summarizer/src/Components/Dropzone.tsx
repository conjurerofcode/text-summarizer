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
  borderRadius: 2,
  borderColor: "grey",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
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
  } = useDropzone({ accept: { "image/*": [] } });

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

      <p>Drag 'n' drop some files here, or click to select files</p>

      {/* <ul>{files}</ul> */}
    </div>
  );
};

export default Dropzone;
