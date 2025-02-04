import { useEffect, useRef, useState } from "react";
import { generateWords } from "./helperFunctions";
import { v4 as uuidv4 } from "uuid";

const Textbox = () => {

  const originalSystemPrompt = `The user is writing a story or book. 
  You are an auto-completer bot who is supposed to help them with writer's block and to help them continue their story. 
  Please return 5-8 words as an autocompletion to go between the input prefix and input suffix below. 
  Make sure the words you generate flow well inside the input and are grammatically correct. 
  Remember to ONLY RETURN the newly generated words and not the entire input.

  input prefix: "[input_prefix]"

  input suffix: "[input_suffix]"`;

  const textRef = useRef<HTMLDivElement>(null);
  const [textThree, setTextThree] = useState<number>(0);
  const [makeSuggestion, setMakeSuggestion] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [systemPrompt, setSystemPrompt] =
    useState<string>(originalSystemPrompt);
  const [declinedSuggestions, setDeclinedSuggestions] = useState<string[]>([]);

  const getCursorPos = () => {
    // get the current cursor position in the div textbox
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(textRef.current as Node);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      return clonedRange.toString().length;
    }
    return 0;
  }

  const getText = () => {
    if (textRef.current) {
      return textRef.current.textContent as string;
    }
    return "";
  }

  const setText = (newText: string) => {
    const div = textRef.current;
    if (div) {
      div.textContent = newText;
    }
  };

  const updateText = (newText: string) => {
    setText(newText);
    localStorage.setItem("text", newText);
  };

  const updateSystemPrompt = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
    localStorage.setItem("systemPrompt", newPrompt);
  };

  useEffect(() => {
    const storedPrompt = localStorage.getItem("systemPrompt");
    const storedText = localStorage.getItem("text");

    if (storedPrompt) {
      setSystemPrompt(storedPrompt);
    }
    if (storedText) {
      setText(storedText);
      setTextThree(
        storedText.trim() === "" ? 0 : storedText.trim().split(/\s+/).length
      );
    }
  }, []);

  useEffect(() => {
    if (makeSuggestion) {
      const cursorPos = getCursorPos();

      // Generate a suggestion
      generateWords(getText(), systemPrompt, cursorPos).then((s) => {
        setSuggestion(s);
        if (textRef.current) {
          // Create a span element for the suggestion
          const span = document.createElement("span");
          span.textContent = s;
          span.style.color = "gray";
          span.style.fontStyle = "italic";
          // Insert the suggestion at the cursor position
          const textBeforeCursor = getText().slice(0, cursorPos);
          const textAfterCursor = getText().slice(cursorPos);
          setText(textBeforeCursor);
          textRef.current.appendChild(span);
          textRef.current.appendChild(document.createTextNode(textAfterCursor));
          // make sure the cursor position is maintained
          const range = document.createRange();
          const selection = window.getSelection();
          if (selection) {
            range.setStart(textRef.current.childNodes[0], cursorPos);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        // suggestion has been made, so reset the makeSuggestion state
        setMakeSuggestion(false);
      });
    }
  }, [makeSuggestion, systemPrompt]);

  const handleChangeText = (e: any) => {
    const newText = e.target.textContent;
    localStorage.setItem("text", newText);
    const newWordCount = newText.trim() === "" ? 0 : newText.trim().split(/\s+/).length;

    if (newWordCount < textThree) {
      setTextThree(newWordCount);
    } else if (newText[getCursorPos()-1] === " " && newWordCount >= textThree + 3) {
      setTextThree(newWordCount);
      setMakeSuggestion(true);
    }
  };

  const handleChangeSystemPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSystemPrompt(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();

      // Remove the span element and replace it with its text content
      if (textRef.current) {
        let span = textRef.current.querySelector("span");
        if (span) {
          const spanText = span.textContent || "";
          const suggestionLength = spanText.trim().split(/\s+/).length;
          const spanParent = span.parentNode; // this is just the textRef div
          if (spanParent) {
            spanParent.replaceChild(document.createTextNode(spanText), span);

            // make sure the cursor position goes to the end of the suggestion
            const range = document.createRange();
            const selection = window.getSelection();
            if (selection) {
              const textNode = textRef.current?.childNodes[1];
              if (textNode) {
                range.setStart(textNode, textNode.textContent?.length || 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
          setTextThree(textThree + suggestionLength);
          setSuggestion("");
        }
      }
    } else if (suggestion) {
      const cursorPos = getCursorPos();
      // Remove any span elements from the div
      if (textRef.current) {
        const spans = textRef.current.querySelectorAll("span");
        spans.forEach((span) => span.remove());
      }
      // make sure the cursor position is maintained to where it was at the time this key press was made
      const range = document.createRange();
      const selection = window.getSelection();
      if (selection) {
        const textNode = textRef.current?.childNodes[0];
        if (textNode) {
          range.setStart(textNode, cursorPos);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      setDeclinedSuggestions([suggestion, ...declinedSuggestions]);
      setSuggestion("");
    } else if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      setMakeSuggestion(true);
    }
  };

  const handleAcceptSuggestion = (index: number) => {
    const cursorPos = getCursorPos();
    const oldSugg = declinedSuggestions[index];
    if (textRef.current) {
      const spans = textRef.current.querySelectorAll("span");
      spans.forEach((span) => span.remove());
    }
    const currentText = getText();
    const newText = currentText.slice(0, cursorPos) + oldSugg + currentText.slice(cursorPos);
    updateText(newText);
    // Move the cursor to the end of the oldSugg in the div
    const range = document.createRange();
    const selection = window.getSelection();
    if (selection) {
      const textNode = textRef.current?.childNodes[0];
      if (textNode) {
      range.setStart(textNode, cursorPos + oldSugg.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      }
    }
    const suggestionLength = oldSugg.split(/\s+/).length;
    setTextThree(textThree + suggestionLength);
    setDeclinedSuggestions(declinedSuggestions.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#4A90E2", fontSize: "24px", textAlign: "center" }}>
        Auto Completion Tool
      </h1>

      <p style={{ fontSize: "14px", color: "#333" }}>
        Text (generate suggestion with <strong>Command/Ctrl + I</strong> or
        automatically every 3-4 words. Make sure to pause typing during these times to allow for generated words to display)
      </p>

      <div
        contentEditable
        ref={textRef}
        style={{
          width: "97%",
          height: "400px",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginBottom: "15px",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
        onInput={(e) => handleChangeText(e as any)}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      />

      <p style={{ marginBottom: "10px" }}>
        <strong>Declined Suggestions:</strong>{" "}
        {declinedSuggestions.length === 0 && "None"}
      </p>

      <ul style={{ listStyleType: "none", padding: "0" }}>
        {declinedSuggestions.map((suggestion, index) => (
          <li key={uuidv4()} style={{ marginBottom: "8px" }}>
            <button
              style={{
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: makeSuggestion ? "not-allowed" : "pointer",
                opacity: makeSuggestion ? 0.6 : 1,
              }}
              disabled={!!makeSuggestion}
              onClick={() => handleAcceptSuggestion(index)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: "14px", marginTop: "20px", color: "#666" }}>
        Below is the system prompt for auto completions. All occurrences of
        [input_prefix] and [input_suffix] in your system prompt will be replaced with the actual input
        text above before and after the cursor position of the generation. Feel free to edit the system prompt to optimize
        the autocompletion suggestions to your use case.
      </p>

      <textarea
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "none",
          marginBottom: "15px",
        }}
        value={systemPrompt}
        onChange={handleChangeSystemPrompt}
        disabled={!!makeSuggestion}
      />

      <button
        style={{
          backgroundColor: "#4A90E2",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => updateSystemPrompt(originalSystemPrompt)}
        disabled={!!makeSuggestion}
      >
        Reset system prompt to original
      </button>
    </div>
  );
};

export default Textbox;