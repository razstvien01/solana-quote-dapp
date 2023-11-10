import ReactDOM from "react-dom"
import { App } from "src/App"
import "./index.css"
import { Buffer } from 'buffer';
// Make Buffer available globally if it's not already (for browser use)
window.Buffer = Buffer;

ReactDOM.render(<App />, document.getElementById("root"))
