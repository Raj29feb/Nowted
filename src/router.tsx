import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { NotFound } from "./components/not-found";

export const router = createBrowserRouter([
    {
        path: "/:folderName?/:folderId?/:fileId?",
        element: <App />
    }, { path: "*", element: <NotFound /> }
]);
