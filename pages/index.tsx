import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { useAuthContext } from "./../hooks/useAuthContext";
import FileForm from "./../components/FileForm";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? // ? process.env.API_URL
      "https://gpt3summary-backend.herokuapp.com"
    : "http://localhost:4000";

export default function Home() {
  const { user } = useAuthContext();
  const [userInput, setUserInput] = useState("");

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  let fileReader;

  const handleFileRead = async (e) => {
    const content = fileReader.result;

    const contentArray = content.match(/[\s\S]{1,3000}/g);
    console.log("!!! contentArray.length:", contentArray.length);
    // console.log("contentArray[2] ", contentArray[2]);
    setApiOutput("");

    const firstInput =
      "this is the starting fragment of a large document. tell me what type of document it is and give me a summary";

    // … do something with the 'content' …

    const results = await Promise.all(
      contentArray.map(async (chunk, index) => {
        if (index == 0) {
          const response = await fetch(`${BASE_URL}/api/openai`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userInput: `${firstInput} ${chunk.replace(/(\r\n|\n|\r)/gm, "")}`,
            }),
          });
          const json = await response.json();

          if (!response.ok) {
            setIsGenerating(false);
            // setError(json.error);
            console.log("!!!!response not ok Error:", json.error);
          }
          if (response.ok) {
            console.log("res json: ", JSON.stringify(json));
          }

          const { output } = json;
          console.log("OpenAI replied...", output.text);

          // setApiOutput((prev) => `${prev} ${output.text}`);
          setApiOutput(output.text);
          setIsGenerating(false);
        }

        if (index > 0 && index < 5) {
          const response = await fetch(`${BASE_URL}/api/openai`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userInput: `This is the summary of the beginnig of the document: \n${apiOutput}\n This is the next fragment of the same document:${chunk.replace(
                /(\r\n|\n|\r)/gm,
                ""
              )} \n Give me the summary of the whole document:`,
            }),
          });
          const json = await response.json();

          if (!response.ok) {
            setIsGenerating(false);
            // setError(json.error);
            console.log("!!!!response not ok Error:", json.error);
          }
          if (response.ok) {
            console.log("res json: ", JSON.stringify(json));
          }

          const { output } = json;
          console.log("OpenAI replied...", output.text);

          // setApiOutput((prev) => `${prev} ${output.text}`);
          setApiOutput(output.text);
          setIsGenerating(false);
        }

        return chunk;
      })
    );
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const handlePDFExtract = async (e) => {
    e.preventDefault();
    setApiOutput("");
    setIsGenerating(true);
    const response = await fetch("http://localhost:4000/extract", {
      method: "GET",
    });

    const json = await response.json();

    if (!response.ok) {
      setIsGenerating(false);
      // setError(json.error);
      console.log("!!!!response not ok Error:", json.error);
    }
    if (response.ok) {
      console.log("res json: ", JSON.stringify(json));
    }

    const { output } = json;
    console.log("OpenAI replied...", output);

    // setApiOutput((prev) => `${prev} ${output.text}`);
    setApiOutput(output);
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Get summary of your document</h1>
          </div>
          <div className="header-subtitle">
            <h2>Upload txt file and get the summary of the content</h2>
          </div>
        </div>

        <input
          type="file"
          id="file"
          className={
            isGenerating ? "generate-button loading" : "generate-button"
          }
          accept=".txt"
          onChange={(e) => handleFileChosen(e.target.files[0])}
        />

        <div className="prompt-container">
          {/* New code I added here */}
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Summary</h3>
                </div>
              </div>
              <div className="output-content">
                <p contentEditable="true">{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
        <div className="generate-button">
          <button onClick={handlePDFExtract}>PDF demo</button>
        </div>
      </div>
    </div>
  );
}
