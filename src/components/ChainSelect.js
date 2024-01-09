import React from 'react';
import { Form } from 'react-bootstrap';

const ChainSelect = ({ chainrpc, averageBlockTime, onCheckboxChange }) => {
  const containerStyle = {
    textAlign: 'center',
  };

  const checkboxStyle = {
    display: 'inline-block',
    margin: '0 30px', 
    fontSize: '26px', 
  };

  return (
    <>
    <div style={{textAlign: 'center', marginTop: '2rem'}}><h5>Select Chain Name</h5></div>
    <Form style={containerStyle}>
      <div>
        <Form.Check
          style={checkboxStyle}
          type="checkbox"
          label="Mantle"
          checked={chainrpc === 'https://mantle.drpc.org'}
          onChange={() => onCheckboxChange('https://mantle.drpc.org', 4)}
        />

        <Form.Check
          style={checkboxStyle}
          type="checkbox"
          label="Linea"
          checked={chainrpc === 'https://1rpc.io/linea'}
          // Average Block Time for Linea is taken as 6 seconds
          onChange={() => onCheckboxChange('https://1rpc.io/linea', 6)}
        />

        <Form.Check
          style={checkboxStyle}
          type="checkbox"
          label="Kroma"
          checked={chainrpc === 'https://api.kroma.network'}
          // Average Block Time for Kroma is taken as 2 seconds
          onChange={() => onCheckboxChange('https://api.kroma.network', 2)}
        />
      </div>
    </Form>
    </>
  );
};

export default ChainSelect;
