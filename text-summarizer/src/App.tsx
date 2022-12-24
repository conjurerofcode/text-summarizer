import {
  CSSProperties,
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import { Card, Input, InputLabel, Button, CardContent } from "@mui/material";
import axios from "axios";
import "./App.css";
import Grid from "@mui/material/Grid";
import Dropzone from "./Components/Dropzone";
import { useTransition, animated } from "react-spring";

const allowedFiles = [
  "text/plain",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/msword",
  "application/pdf",
];
const pageStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const apiURL = "http://localhost:4321/";

// TODO - Fix theme (Font, colors, etc...)

function App() {
  const [file, setFile] = useState<File>();
  const [sendFile, setSendFile] = useState<File>();
  const [error, setError] = useState("No Errors");

  const [style, setStyle] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
    scale: 1,
    titleSize: "4em",
  });

  const transition = useTransition(file == undefined, {
    transitionDelay: 100,
    config: { mass: 1, tension: 400, friction: 8, clamp: true },
    from: { opacity: 0, y: 150 },
    enter: { opacity: 1, y: 200 },
    leave: { opacity: 0, y: 250 },
    exitBeforeEnter: true,
  });

  const handleResize = () => {
    setStyle({
      height: window.innerHeight * 0.35,
      width:
        window.innerWidth >= 1920
          ? window.innerWidth * 0.35
          : window.innerWidth * 0.55,
      scale: window.innerWidth >= 1920 ? 1.3 : 1,
      titleSize: window.innerWidth >= 1920 ? "4em" : "3em",
    });
  };

  const handleDragEvent = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.items) return;
    const file = e.dataTransfer.items[0].getAsFile();
    if (file == null) return;
    console.log(file);
    setFile(() => file);
    // setUploaded((prev) => !prev);
  };

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
    setFile(() => file);
  };

  // TODO - Send to server
  const handleFileSubmit = () => {
    if (!file) {
      console.log("Err");
      return;
    }

    setSendFile(() => file);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (sendFile == undefined) return;

    console.log(`sending: ${sendFile.name}`);
    const data = new FormData();
    data.append("file", sendFile, `${sendFile.name}`);
    axios.post(`${apiURL}uploadFile`, data).then((res) => {
      // console.log(res.statusText);
      setError(res.statusText);
    });
  }, [sendFile]);

  const cardStyle = {
    minHeight: "200px",
    minWidth: "400px",
    height: style.height,
    width: style.width,
    marginTop: "17%",
    boxShadow: "0px 0px 7px 3px rgba(255, 255, 255, .2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexdirection: "column",
    transform: `scale(${style.scale}, ${style.scale})`,
    borderRadius: "30px",
    backgroundColor: "rgba(255, 255, 255, .10)",
    backdropFilter: "blur(5px)",
    color: "white",
    fontSize: "1.5em",
  };

  const titleStyle: CSSProperties = {
    position: "absolute",
    color: "white",
    top: 10,
    fontSize: style.titleSize,
    textShadow: "0px 0px 7px rgba(255, 255, 255, .75)",
  };

  return (
    <div style={pageStyle}>
      <div className="bg" />
      <h1 style={titleStyle}>Document Summarizer-er</h1>
      {transition((transitionStyle, item) =>
        item ? (
          <animated.div style={transitionStyle}>
            <Card style={cardStyle}>
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
                    <Grid item></Grid>
                    <Grid item>
                      <Button
                        style={{ marginRight: "35px" }}
                        variant="contained"
                        component="label"
                      >
                        Or Upload Here
                        <input type="file" hidden onChange={handleFileUpload} />
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </form>
            </Card>
          </animated.div>
        ) : (
          <animated.div style={transitionStyle}>
            <Card style={cardStyle}>
              <CardContent>
                <Grid
                  container
                  justifyItems="center"
                  alignItems="center"
                  spacing={5}
                  direction="column"
                >
                  <Grid item>Name: {file?.name}</Grid>
                  <Grid item>Size: {file?.size}</Grid>
                  <Grid item>Type: {file?.type}</Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={handleFileSubmit}
                      style={{ marginRight: "15px" }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="contained"
                      component="label"
                      onClick={() => {
                        setFile(undefined);
                      }}
                    >
                      Cancel{" "}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </animated.div>
        )
      )}
      <div style={{ position: "absolute", color: "white", bottom: "20%" }}>
        {" "}
        {error}
      </div>
    </div>
  );
}

export default App;

// const futureAllowedFiles = [
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];
