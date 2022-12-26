import {
  CSSProperties,
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
  useRef,
} from "react";
import { Card, Input, InputLabel, Button, CardContent } from "@mui/material";
import axios from "axios";
import "./App.css";
import Grid from "@mui/material/Grid";
import Dropzone from "./Components/Dropzone";
import { useTransition, animated } from "react-spring";
import {
  ImageSources,
  extractTextFromFile,
  getImageSource,
  imageToText,
} from "./Components/Utilities";

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

const isImage = (file: File): boolean => {
  const mimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (mimeTypes.includes(file.type)) return true;
  else return false;
};

const apiURL = "http://localhost:4321/";

// TODO - Fix theme (Font, colors, etc...)

function App() {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");
  const [iconSrc, setIconSrc] = useState(ImageSources.default);
  const [style, setStyle] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
    scale: 1,
    titleSize: "4em",
  });
  const [returnedText, setReturnedText] = useState("");

  const transition = useTransition(file == undefined, {
    transitionDelay: 100,
    config: { mass: 1, tension: 400, friction: 8, clamp: true },
    from: { opacity: 0, y: -20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 20 },
    exitBeforeEnter: true,
  });

  const largerTransition = useTransition(returnedText === "", {
    transitionDelay: 100,
    config: { mass: 1, tension: 400, friction: 8, clamp: true },
    from: { opacity: 0, y: -20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 20 },
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

  const handleDragEvent = async (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.items) return;
    const file = e.dataTransfer.items[0].getAsFile();
    if (file == null) return;

    const src = getImageSource(file);
    setIconSrc((prev) => src);
    setFile((prev) => file);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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

    const src = getImageSource(file);
    setIconSrc((prev) => src);
    setFile((prev) => file);
  };

  // TODO - Send to server
  // Always shows as undefined on server side
  const handleFileSubmit = async () => {
    if (!file || file == undefined) return;

    // ---------- testing -----------------
    if (isImage(file)) {
      const apiCall = await imageToText(file);
      console.log(apiCall);
      setReturnedText((prev) => apiCall.data);
      return;
    }
    // ---------- testing -----------------
    console.log(file);
    const text = await extractTextFromFile(file);
    // console.log(text.slice(0, 20));
    axios({
      method: "GET",
      url: "http://127.0.0.1:5000/imageToText",
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
      });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   if (!file || file == undefined) return;
  //   const src = getImageSource(file);
  //   setIconSrc((prev) => src);
  // }, [file]);

  const cardStyle = {
    minHeight: "200px",
    minWidth: "400px",
    height: style.height,
    width: style.width,
    boxShadow: "0px 0px 7px 3px rgba(255, 255, 255, .2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexdirection: "column",
    transform: `scale(${style.scale}, ${style.scale}) translate(0, 75%)`,
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

  const documentPreviewStyle = {
    background: "linear-gradient(to bottom, white, transparent)",
    height: "150px",
    width: "400px",
    // padding: "20px";
  };

  const iconStyle = {
    height: "50px",
    width: "50px",
  };

  return (
    <div style={pageStyle}>
      <div className="bg" />
      <h1 style={titleStyle}>Document Summarizer-er</h1>
      <form method="post" encType="multipart/form-data">
        {returnedText === "" ? (
          <Card style={cardStyle}>
            {transition((transitionStyle, item) =>
              item ? (
                <animated.div style={transitionStyle}>
                  <CardContent>
                    <Grid
                      container
                      justifyItems="center"
                      alignItems="center"
                      spacing={4}
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
                          <input
                            id="file"
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                          />
                          Or Upload Here
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </animated.div>
              ) : (
                <animated.div style={transitionStyle}>
                  <CardContent>
                    <Grid
                      container
                      justifyItems="center"
                      alignItems="center"
                      spacing={2}
                      direction="column"
                    >
                      <Grid item>
                        Name: {file?.name} Size: {file?.size} MB
                      </Grid>

                      <Grid item>
                        <img style={iconStyle} src={iconSrc}></img>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          style={{ marginRight: "15px" }}
                          onClick={() => {
                            handleFileSubmit();
                          }}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="contained"
                          component="label"
                          onClick={() => {
                            setFile((prev) => undefined);
                          }}
                        >
                          Cancel{" "}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </animated.div>
              )
            )}
          </Card>
        ) : (
          <Card style={cardStyle}>
            <CardContent>
              <div>{returnedText}</div>
              <Button
                variant="contained"
                component="label"
                onClick={() => {
                  setReturnedText((prev) => "");
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}
      </form>
      <div style={{ position: "absolute", color: "white", bottom: "20%" }}>
        {error}
      </div>
    </div>
  );
}

export default App;

// const futureAllowedFiles = [
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];
