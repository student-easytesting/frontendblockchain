import React from "react";

const Block = ({ block, toggleBlockDetails }) => {
  return (
    <div className="block" onClick={() => toggleBlockDetails(block.number)}>
      <p>Block {block.number}</p>
    </div>
  );
};

export default Block;
