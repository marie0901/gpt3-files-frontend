import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { useAuthContext } from "./../hooks/useAuthContext";
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? // ? process.env.API_URL
      "https://gpt3-files-backend.herokuapp.com"
    : "http://localhost:4000";

export default function Home() {
  const { user } = useAuthContext();
  const [userInput, setUserInput] = useState("");

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const basePromptPrefix = `
I talk to a famous psychologist who is also the my best  friend.
I am an adoult women have some times a depression.
I ask the friend to advise me how to recover after a particular situation
Give me the answer of my friend in 1st person, in informal way about the following situation, 
Situation: 
`;

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch(`/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const getSummary = async () => {
    // setIsLoading(true)
    // setError(null)
    console.log("!!!userInput..", userInput);

    const response = await fetch(`${BASE_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });
    const json = await response.json();

    if (!response.ok) {
      // setIsLoading(false)
      // setError(json.error)
      console.log("!!!!response not ok Error:", json.error);
    }
    if (response.ok) {
      console.log("res json: ", JSON.stringify(json));

      // // update the auth context
      // dispatch({type: 'LOGIN', payload: json})

      // // update loading state
      // setIsLoading(false)
    }
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  let fileReader;

  const handleFileRead = async (e) => {
    const content = fileReader.result;

    const contentArray = content.match(/[\s\S]{1,3000}/g);
    console.log("!!! contentArray.length:", contentArray.length);
    setApiOutput("");
    // … do something with the 'content' …

    const results = await Promise.all(
      contentArray.map(async (chunk, index) => {
        if (index < 5) {
          const response = await fetch(`${BASE_URL}/api/openai`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userInput: chunk.replace(/(\r\n|\n|\r)/gm, ""),
            }),
          });
          const json = await response.json();

          if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            console.log("!!!!response not ok Error:", json.error);
          }
          if (response.ok) {
            console.log("res json: ", JSON.stringify(json));
          }

          const { output } = json;
          console.log("OpenAI replied...", output.text);

          setApiOutput((prev) => `${prev} ${output.text}`);
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
          {/* <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={getSummary}
            >
              <div className="generate">
                {isGenerating ? (
                  <span class="loader"></span>
                ) : (
                  <p>Generate Summary</p>
                )}
              </div>
            </a>
          </div> */}

          {/* New code I added here */}
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Summary</h3>
                </div>
              </div>
              <div className="output-content">
                <p contenteditable="true">{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
