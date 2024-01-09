import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Form, Button } from 'react-bootstrap';
import PopUp from './PopUp';
import ChainSelect from './ChainSelect';
import Card from 'react-bootstrap/Card';

const Checkbalance = () => {
  const [contractAddress, setContractAddress] = useState('0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7');
  const [balance, setBalance] = useState(null);
  const [percent, setPercent] = useState(null);
  const [chainrpc, setChainrpc] = useState('');
  const [averageBlockTime, setAverageBlockTime] = useState(null);
  let show=false;

  // This function changes the chainrpc and averageBlockTime when a check box is checked
  // passed as a parameter in ChainSelect component
  const handleCheckboxChange = (selectedChainrpc, selectedAverageBlockTime) => {
    setChainrpc(selectedChainrpc);
    setAverageBlockTime(selectedAverageBlockTime);
  };

  // 
  const getBalanceDetails = async () => {
    const provider = new ethers.providers.JsonRpcProvider(chainrpc);
    // Get current timestamp
    const currentTimeStamp = GetcurrentTimeStamp();
    
    // Get Block Number associated with the current timestamp
    const currentBlockNumber = await getBlockNumberOnGivenTime(currentTimeStamp);

    // Get balance at the current timestamp
    const currentBalance = await provider.getBalance(contractAddress, currentBlockNumber);
  
    // Format balance from wei to ether
    const resultCurrentBalance = ethers.utils.formatEther(currentBalance);
    console.log("Result current balance:", resultCurrentBalance);

    setBalance(resultCurrentBalance);
  
    // Get the timestamp 12hrs before the current timestamp
    const timestamp12HoursAgo = getTimestamp12HoursAgo();

    // Get Block Number associated with that timestamp
    const blockNumber12HoursAgo = await getBlockNumberOnGivenTime(timestamp12HoursAgo);

    // Get balance at that timestamp
    const balance12HoursAgo = await provider.getBalance(contractAddress, blockNumber12HoursAgo);
  
    // Convert it to ether
    const resultBalance12HoursAgo = ethers.utils.formatEther(balance12HoursAgo);
    console.log("Result balance 12 hours ago:", resultBalance12HoursAgo);

    // Calculate percentage change
    const change = currentBalance - balance12HoursAgo;

    // Set the variable show as true if balance has decreased in the last 12 hours
    // Will be used to display the PopUp
    if (resultCurrentBalance<resultBalance12HoursAgo) {
      show=true;
    }

    // Calculate Percentage Change and round off to 2 decimal places
    const percentage = parseFloat(((change / balance12HoursAgo) * 100).toFixed(2));

    console.log(percentage);
    setPercent(percentage);

  };

  // Get the current timestamp
  const GetcurrentTimeStamp = () => {
    const currentTimeStamp = Math.floor(new Date().getTime()/1000);
    console.log("curr timestamp:", currentTimeStamp);
    return currentTimeStamp;
  }

  // Get the timestamp 12 hrs ago
  function getTimestamp12HoursAgo() {
    const currentTimestamp = Math.floor(new Date().getTime()/1000);
    const twelveHoursInSeconds = 2 * 60 * 60; // 12 hours in seconds
    const timestamp12HoursAgo = currentTimestamp - twelveHoursInSeconds;
  
    return timestamp12HoursAgo;
  }
  
  // const currentTimeStamp = getTimestamp12HoursAgo();
  // console.log('Timestamp 12 hours ago:', currentTimeStamp);

  // get block associated to the target timestamp
  async function getBlockNumberOnGivenTime(targetTimestamp) {
    const provider = new ethers.providers.JsonRpcProvider(chainrpc);
    const currentBlock = await provider.getBlock('latest');
    
    // estimate the block number based on the formula below using average block time
    const blockNumberEstimate = currentBlock.number - Math.ceil((currentBlock.timestamp - targetTimestamp) / averageBlockTime);
    console.log('Estimated blocknumber:', blockNumberEstimate);
    return blockNumberEstimate;
  }

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    getBalanceDetails();
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
  };
  
  const cardStyle = {
    width: '500px',
    margin: '0 10px',
  };

  useEffect(()=> {
    console.log("balance changed")
  }, [balance])
  return (
    <div>
      {/* Show the PopUp if percentage>10 AND if the balance has decreased in the last 12 hours  */}
      {percent > 10 && show && <PopUp/>}

      {/* Allows the user to select the Chain Name  */}
      <ChainSelect chainrpc={chainrpc} averageBlockTime={averageBlockTime} onCheckboxChange={handleCheckboxChange}></ChainSelect>

      {/* Form for putting the contract address */}
      <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', marginTop: '2rem' }}>
        <Form.Group controlId="formContractAddress">
          <Form.Label>Contract Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contract address"
            // value="Enter contract address"
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </Form.Group>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Button variant="primary" type="submit">
            Check Balance
          </Button>
        </div>

      </Form>

      {/* If Balance is not null then display the balance details */}
      {balance !== null && (
        <div style={{ textAlign: 'center', marginTop: '2rem'}}>

          <div style={containerStyle}>
            <Card style={cardStyle}>
              <Card.Header as="h5">Token Balance</Card.Header>
              <Card.Body>
                <Card.Title>{balance}</Card.Title>
              </Card.Body>
            </Card>

            <Card style={cardStyle}>
              <Card.Header as="h5">Percentage Change in past 12 hours</Card.Header>
              <Card.Body>
                <Card.Title>{percent} %</Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkbalance;
