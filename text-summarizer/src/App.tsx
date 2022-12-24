import {
  CSSProperties,
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import {
  Card,
  Input,
  InputLabel,
  Button,
  FormControl,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Dropzone from "./Components/Dropzone";

const allowedFiles = ["text/plain", "image/png", "image/jpg", "image/jpeg"];
const futureAllowedFiles = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];

function App() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [file, setFile] = useState<File>();

  const handleResize = () => {
    setDimensions({
      height: window.innerHeight * 0.35,
      width: window.innerWidth * 0.35,
    });
  };

  const handleFileSubmit = () => {
    if (!file) {
      console.log("Err");
      return;
    }
    alert(file.name);
  };
  const handleDragEvent = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.items) return;
    const file = e.dataTransfer.items[0].getAsFile();
    if (file == null) return;
    console.log(file);
    setFile(file);
  };

  useEffect(() => {
    console.log("useEffect: File ran");
  }, [file]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) {
      e.target.value = "";
      return;
    }

    const file = e.target.files[0];

    if (!allowedFiles.includes(file.type)) {
      e.target.value = "";
      return;
    }

    console.log(file);
    setFile(file);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const cardStyle = {
    minHeight: "200px",
    minWidth: "400px",
    height: dimensions.height,
    width: dimensions.width,
    backgroundColor: "grey",
    marginTop: "10%",
    boxShadow: "5px 5px 7px 3px rgba(0, 0, 0, .2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexdirection: "column",
  };

  const dropStyle = {
    height: "75px",
    width: "150px",
    borderWidth: "2px",
  };

  return (
    <div style={pageStyle}>
      <Card variant="outlined" style={cardStyle}>
        <form>
          <CardContent>
            <Grid
              container
              justifyItems="center"
              alignItems="center"
              spacing={2}
              direction="column"
            >
              <Grid item>
                <Dropzone fileHandler={handleDragEvent} />
              </Grid>
              <Grid item>
                <Button
                  style={{ marginRight: "35px" }}
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  onClick={handleFileSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

const pageStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default App;

//                 <Dropzone />
//               </Grid>
//             </Grid>
