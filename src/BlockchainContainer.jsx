import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Block from "./Block";
import BlockDetails from "./BlockDetails";
import { ethers } from "ethers";
import Abi from "./assets/ABI.json";

const APIV = import.meta.env.VITE_APP_URI_APIV;

const API = import.meta.env.VITE_APP_URI_API;

const BlockchainContainer = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const blockchainContainerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [voteData, setVoteData] = useState("");
  const [winnerData, setWinnerData] = useState("");
  const [registerData, setRegisterData] = useState("");

  const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Abi, provider);

    const handleCastVote = async (userAddress, cityId, ranking, timestamp) => {
      // console.log(
      //   userAddress,
      //   cityId,
      //   ranking[0],
      //   ranking[1],
      //   ranking[2],
      //   ranking[3],
      //   ranking[4],
      //   timestamp
      // );

      const response = await axios.get(`${APIV}/auth/candidates`);
      const candidates = response.data;

      const response1 = await axios.get(`${APIV}/auth/cities`);
      const cities = response1.data;

      const data = `${userAddress} => Voted, City => ${
        cities[cityId]
      } ,   Preferences =>  ${candidates[cityId][ranking[0]]},    ${
        candidates[cityId][ranking[1]]
      },    ${candidates[cityId][ranking[2]]},    ${
        candidates[cityId][ranking[3]]
      },     ${candidates[cityId][ranking[4]]},   Timestamp => ${timestamp}`;

      console.log(data);
      setVoteData(data);
    };

    contract.on("CastVote", handleCastVote);

    const handleRegisterVoter = (userAddress, timestamp) => {
      // console.log(userAddress, timestamp);
      const data = `${userAddress} => Registered, Timestamp => ${timestamp}`;
      console.log(data);
      setRegisterData(data);
    };

    contract.on("RegisterVoter", handleRegisterVoter);

    const handlecitywinner = (city, winner, teamId, timestamp) => {
      // console.log(city, winner, `team ${teamId}`, timestamp);
      const data = `City => ${city}, Winner => ${winner}, Team => ${`team ${teamId}`}, Timestamp => ${timestamp}`;
      console.log(data);
      setWinnerData(data);
    };

    contract.on("citywinner", handlecitywinner);
  }, []);

  // Fetch initial blockchain data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/blocks`);
        setBlocks(response.data);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };
    fetchData();
  }, [blocks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API}/mine`, {
          data: registerData,
        });
        setBlocks(response.data);
      } catch (error) {
        console.error("Error adding new block:", error);
      }
    };
    if (registerData) {
      fetchData();
    }
  }, [registerData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API}/mine`, {
          data: winnerData,
        });
        setBlocks(response.data);
      } catch (error) {
        console.error("Error adding new block:", error);
      }
    };
    if (winnerData) {
      fetchData();
    }
  }, [winnerData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API}/mine`, {
          data: voteData,
        });
        setBlocks(response.data);
      } catch (error) {
        console.error("Error adding new block:", error);
      }
    };
    if (voteData) {
      fetchData();
    }
  }, [voteData]);

  // Add a new block and update the blockchain
  const addBlock = async () => {
    try {
      const response = await axios.post(`${API}/mine`, {
        data: "New data",
      });
      setBlocks(response.data);
    } catch (error) {
      console.error("Error adding new block:", error);
    }
  };

  useEffect(() => {
    const blockchainContainer = blockchainContainerRef.current;

    const handleMouseDown = (e) => {
      setIsDown(true);
      setStartX(e.pageX - blockchainContainer.offsetLeft);
      setScrollLeft(blockchainContainer.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDown(false);
    };

    const handleMouseUp = () => {
      setIsDown(false);
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - blockchainContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // Slow down scroll speed
      blockchainContainer.scrollLeft = scrollLeft - walk;
    };

    blockchainContainer.addEventListener("mousedown", handleMouseDown);
    blockchainContainer.addEventListener("mouseleave", handleMouseLeave);
    blockchainContainer.addEventListener("mouseup", handleMouseUp);
    blockchainContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      blockchainContainer.removeEventListener("mousedown", handleMouseDown);
      blockchainContainer.removeEventListener("mouseleave", handleMouseLeave);
      blockchainContainer.removeEventListener("mouseup", handleMouseUp);
      blockchainContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDown, startX, scrollLeft]);

  useEffect(() => {
    if (blocks.length > 0) {
      const lastBlock = blockchainContainerRef.current.lastChild;
      lastBlock.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [blocks]);

  const toggleBlockDetails = (blockNumber) => {
    if (selectedBlock && selectedBlock.number === blockNumber) {
      setSelectedBlock(null);
    } else {
      setSelectedBlock(blocks.find((block) => block.number === blockNumber));
    }
  };

  return (
    <div className="blockchain-wrapper">
      <div className="blockchain-container" ref={blockchainContainerRef}>
        <div className="blockchain">
          {blocks.map((block) => (
            <Block
              key={block.number}
              block={block}
              toggleBlockDetails={toggleBlockDetails}
            />
          ))}
        </div>
      </div>
      <BlockDetails block={selectedBlock} />
      <button onClick={addBlock}>Add Block</button>
    </div>
  );
};

export default BlockchainContainer;
