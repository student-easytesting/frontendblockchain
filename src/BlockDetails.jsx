import React from "react";

const BlockDetails = ({ block }) => {
  if (!block) {
    return <div className="block-details"></div>;
  }

  const date = new Date(block.timestamp);
  return (
    <div className={`block-details ${block ? "active" : ""}`}>
      <h2>Block {block.number} Details</h2>
      <div className="card">
        <div>
          <span className="data bold aadhar">Block Number:</span>
          <span className="data aadhar">{block.number}</span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Hash:</span>
          <span className="data aadhar"> {block.hash}</span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Previous Hash:</span>
          <span className="data aadhar"> {block.prevHash}</span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Timestamp:</span>
          <span className="data aadhar">
            {" "}
            {`${block.timestamp}  [${date.toLocaleString()}]`}
          </span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Data:</span>
          <span className="data aadhar"> {block.data}</span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Nonce:</span>
          <span className="data aadhar">{block.nonce}</span>{" "}
        </div>
        <div>
          <span className="data bold aadhar">Difficulty:</span>
          <span className="data aadhar"> {block.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
