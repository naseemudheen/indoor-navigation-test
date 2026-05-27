import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from 'react-helmet-async';
import {
  DirectionPage,
  HelpPage,
  HomePage,
  LogoPage,
  NavigationPage,
  ServicesPage,
  StepsPage,
  CreatorPage,
} from "./pages";
import store from "./redux/store";
import pathData from "./data/maps/groundfloor_data.json";

/**
 * Current Floor Plan Data Structure (e.g., "./data/maps/groundfloor_data.json" or maps under "src/data/maps/"):
 * 
 * The floor plan is represented as an array of path/node objects forming a navigable graph:
 * [
 *   {
 *     "id": string,               // Unique identifier for the point/room (e.g., "path-1", "WARD-16-main")
 *     "coordinates": [x, y],      // Normalized coordinates [0.0 to 1.0] relative to the floor plan image size
 *     "floor": number|string,     // Optional/Required floor number (e.g., 0, 1, "C1")
 *     "name": string,             // Optional display name of the room/location (e.g., "WARD 42")
 *     "neighbors": [              // Array of adjacent nodes connected to this node
 *       {
 *         "id": string,           // Neighbor node ID
 *         "coordinates": [x, y],  // Neighbor coordinates
 *         "distance": number,     // Distance (Euclidean) between this node and the neighbor
 *         "floor": number|string, // Optional floor of neighbor (e.g., if changing floors via stairs/lift)
 *         "isParent": boolean,    // Optional flag for tree/graph traversal
 *         "message": string       // Optional routing message (e.g., "Go Straight")
 *       }
 *     ]
 *   },
 *   ...
 * ]
 */

function App() {
  const simplifyCoordinates = (pathData) => {
    return pathData.map((path) => ({
      // name: "Lift",
      "coordinates": [path.coordinates[0], path.coordinates[1]],
    }));
  };
  const simplifiedData = simplifyCoordinates(pathData);
  console.log(simplifiedData);

  return (
    <Provider store={store}>
        <HelmetProvider>
      <div className="mx-auto w-full max-w-3xl h-screen">
        <Router>
          <Routes>
            <Route element={<LogoPage />} path="/" />
            <Route element={<HomePage />} path="/home" />
            <Route element={<HelpPage />} path="/help" />
            <Route element={<ServicesPage />} path="/services" />
            <Route element={<DirectionPage />} path="/directions" />
            <Route element={<StepsPage />} path="/steps" />
            <Route element={<NavigationPage />} path="/navigate" />
            <Route element={<CreatorPage />} path="/creator" />
          </Routes>
        </Router>
      </div>
        </HelmetProvider>
    </Provider>
  );
}

export default App;
