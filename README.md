# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# goodchapter

Goodchapter is an app that allows you to track the books you are reading, want to read or have read with OpenLibrary API.

## Steps
Follow these steps to create a book tracker app that allows you to track books you are reading, want to read, or have read using React.js and the OpenLibrary API:

### 1. Set up a React project
- Use a tool like create-react-app to quickly set up a new React project with a basic file structure.

### 2. Define the components
- Decide what components you need for your book tracker app, such as a form to search for books, a list to display the books, and a component to display the details of a selected book.

### 3. Fetch data from the API
- Use the OpenLibrary API to fetch data about books based on user search queries.
- You can use the `fetch()` function or a library like Axios to make API calls.

### 4. Store the book data in state
- Use React's state management to store the data for the books fetched from the API.
- You'll also need to store the current status of each book (reading, want to read, or have read) in the state.

### 5. Implement the form
- Create a form component that allows users to enter a book search query.
- You can use React's controlled components to ensure that the form is synchronized with the state.

### 6. Display the books
- Create a component that displays the list of books fetched from the API.
- You can use a mapping function to loop over the books and render each one as a separate component.
- You'll need to display the current status of each book (reading, want to read, or have read) and provide a way for the user to change the status.

### 7. Show book details
- Create a component to display the details of a selected book.
- You can pass the selected book as a prop to this component and use it to render the details.

### 8. Style the app
- Use CSS to style the components and make the app visually appealing.

### 9. Test and debug
- Test the app thoroughly and fix any bugs that you find.

### 10. Deploy
- Deploy the app to a hosting platform, such as GitHub Pages or Heroku, so that others can use it.

**Note: You may also need to handle pagination when fetching book data from the API and handle errors that may occur during API calls.**