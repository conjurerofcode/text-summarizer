import React from "react";
import docx, { Document } from "docx";
import fileIcon from "../assets/file.png";
import pdfIcon from "../assets/pdf.png";
import txtIcon from "../assets/txt.png";
import axios from "axios";
interface UtilitiesProps {}

const ImageSources = {
  default: fileIcon,
  pdf: pdfIcon,
  txt: txtIcon,
};

const getImageSource = (file: File) => {
  if (!file || file == undefined) return ImageSources.default;

  if (file.type === "application/pdf") return ImageSources.pdf;
  if (file.type === "text/plain") return ImageSources.txt;
  return ImageSources.default;
};

const imageToText = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const header = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const url = `http://127.0.0.1:5000/imageToText`;
  return axios
    .post(url, formData, header)
    .then((res) => ({
      status: res.status,
      data: res.data,
      error: null,
    }))
    .catch((err) => {
      return {
        status: err.response ? err.response.status : 0,
        data: {},
        error: err.message,
      };
    });
};

const Utilities: React.FC<UtilitiesProps> = () => {
  return <div></div>;
};

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "text/plain") {
    // If the file is a text file, read it as a plain text string
    const text = await file.text();
    return text;
  } else if (file.type === "application/msword") {
    // If the file is a Word document, use the FileReader API to read it as a
    // binary string, and then use the docx.js library to extract the text
    //   const binaryString = await file.arrayBuffer();
    //   const doc = new Document(file)
    //   await doc.load(binaryString);
    //   return doc.getText();
    return "Err: DOCX";
  } else if (file.type === "application/pdf") {
    // If the file is a PDF, use the PDF.js library to extract the text
    //   const pdfData = await file.arrayBuffer();
    //   const pdf = await PDFJS.getDocument({ data: pdfData });
    //   let text = '';
    //   for (let i = 1; i <= pdf.numPages; i++) {
    //     const page = await pdf.getPage(i);
    //     const pageText = await page.getTextContent();
    //     text += pageText.items.map(item => item.str).join('');
    //   }
    //   return text;
    return "Err: PDF";
  } else {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
}

export {
  Utilities,
  extractTextFromFile,
  getImageSource,
  ImageSources,
  imageToText,
};

// Thank you
// <a href="https://www.flaticon.com/free-icons/txt" title="txt icons">Txt icons created by Retinaicons - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/pdf" title="pdf icons">Pdf icons created by Retinaicons - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/docx" title="docx icons">Docx icons created by Creativenoys01 - Flaticon</a>
//<a href="https://www.flaticon.com/free-icons/file" title="file icons">File icons created by Good Ware - Flaticon</a>
