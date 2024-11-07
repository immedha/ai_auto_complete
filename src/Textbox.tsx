import { useEffect, useState } from "react"
import { generateWords } from "./helperFunctions";


const Textbox = () => {

  const [text, setText] = useState<string>("");
  const [textThree, setTextThree] = useState<number>(0);
  const [makeSuggestion, setMakeSuggestion] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (makeSuggestion) {
      console.log('making suggestion');
      generateWords(text).then(suggestion => {
        setSuggestion(suggestion);
      });
      setMakeSuggestion(false);
    }
  }, [makeSuggestion, text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    const newWordCount = newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length;

    if (newWordCount < textThree) {
      setTextThree(newWordCount);
    } else if (newText.charAt(newText.length - 1) === ' ' && newWordCount === textThree + 3) {
      console.log('word count is ', newWordCount, ' trying to make suggestion');
      setTextThree(newWordCount);
      setMakeSuggestion(true);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setText(text + suggestion);
      setTextThree(textThree + 5);
      setSuggestion('');
    } else if (e.key.length === 1 && suggestion) {
      setSuggestion('');
    }
  };


  return (
    <div>
      <textarea value={text} onChange={handleChange} onKeyDown={handleKeyDown}/>
      <p>Suggestion: {suggestion}</p>
    </div>
  )
}

export default Textbox;