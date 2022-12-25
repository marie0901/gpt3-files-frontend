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

  const login = async () => {
    // setIsLoading(true)
    // setError(null)

    const response = await fetch(`${BASE_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: "Give me detective story title" }),
    });
    const json = await response.json();

    if (!response.ok) {
      // setIsLoading(false)
      // setError(json.error)
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

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Advise your friend</h1>
          </div>
          <div className="header-subtitle">
            <h2>Describe your situation</h2>
          </div>
        </div>
        {/* Add this code here*/}

        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={login}
            >
              <div className="generate">
                {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>

          {/* New code I added here */}
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <img src="" alt="buildspace logo" />
            {/* <image src={buildspaceLogo} alt="buildspace logo" /> */}
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
}