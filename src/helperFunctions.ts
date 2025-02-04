// export const generateWords = async (input: string, systemPrompt: string, cursorPos: number) => {
//   try {
//     await new Promise(resolve => setTimeout(resolve, 400));
//     return "This is a hardcoded string";
//   } catch (error) {
//     console.error("Error generating words:", error);
//     return "";
//   }
// };



export const generateWords = async (input: string, systemPrompt: string, cursorPos: number) => {
  try {
    const response = await fetch("https://us-central1-ai-auto-complete-a3a36.cloudfunctions.net/generateWords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, systemPrompt, cursorPos }),
    });

    const data = await response.json();
    return data.generatedText || "";
    // return "HEY HEY HEY";
  } catch (error) {
    console.error("Error generating words:", error);
    return "";
  }
};
