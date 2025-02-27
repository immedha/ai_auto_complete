# ai_auto_complete

This app is an inline text auto completion tool. The purpose of it is to help people overcome writer's block by providing them a space to write with the assistance inline AI autocompletion. It emulates Github Copilot with automatic inline completion as well as manual completion on Cmd-I. 

View the website on https://ai-auto-complete-a3a36.web.app/.
Note: the Open AI API key currently is on a billing limit, so if it stops working then it is because it hit that limit. I am currently working on making a place for users to input their own API key.

Running the code locally:
- do `git clone <url>`
- do `cd <repo name>`
- do `npm install`
- create a `.env` file in the root directory with these Firebase environment variables: `REACT_APP_API_KEY`, `REACT_APP_AUTH_DOMAIN`, `REACT_APP_PROJECT_ID`, `REACT_APP_STORAGE_BUCKET`, `REACT_APP_MESSAGING_SENDER_ID`, `REACT_APP_APP_ID`.
- do `npm run start` to run it.

Build and deploy the website by doing `npm run build` and `firebase deploy` in the root directory.
Build and deploy the firebase functions by doing `firebase deploy --only functions` in the root directory.

Tech Stack:
- This website uses Create React App with React/Typescript.
- Firebase is used for hosting.
- Firebase functions are used for a serverless backend.
- This website uses Google Cloud Secrets for storing the Open AI API key.
