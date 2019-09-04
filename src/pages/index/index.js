import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Helloword from "../../components/Helloword";
const Index = () => {
  return (
    <div>
      <Helloword />
      <div className="test">2121</div>
      {[, 2, 12, 2, 2, 2, 2, 2].map(item => {
        return (
          <div className="aaaa">
            <div>{item}</div>
            <div>12123132123</div>
          </div>
        );
      })}
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
