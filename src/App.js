import logo from './logo.svg';
import './App.css';
import Chat from './chat/Chat';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import React from "react";
import ReactDOM from "react-dom";

import "./index.css";

const App = () => <Chat />;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);