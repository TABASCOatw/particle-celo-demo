import React, { useState, useEffect } from 'react';

import { useEthereum, useConnect, useAuthCore } from '@particle-network/auth-core-modal';
import { Celo } from '@particle-network/chains';

import { ethers } from 'ethers';
import { notification } from 'antd';

import './App.css';

const App = () => {
  const { provider } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();

  const [balance, setBalance] = useState(null);

  const customProvider = new ethers.providers.Web3Provider(provider, "any");

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const balanceResponse = await customProvider.getBalance(await customProvider.getSigner().getAddress());

    setBalance(ethers.utils.formatEther(balanceResponse));
  }

  const handleLogin = async (authType) => {
    if (!userInfo) {
      await connect({
        socialType: authType,
        chain: Celo,
      });
    }
  };

  const executeTx = async () => {
    const signer = customProvider.getSigner();
    console.log(await signer.getAddress())


    const tx = {
      to: "0x00000000000000000000000000000000000dEAD0",
      value: ethers.utils.parseEther("0.001")
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: txReceipt.transactionHash
    })
  };

  return (
    <div className="App">
      {!userInfo ? (
        <div className="login-section">
          <button className="sign-button" onClick={() => handleLogin('google')}>Sign in with Google</button>
          <button className="sign-button" onClick={() => handleLogin('twitter')}>Sign in with Twitter</button>
        </div>
      ) : (
        <div className="profile-card">
          <h2>{userInfo.name}</h2>
          <div className="balance-section">
            <small>{balance} CELO</small>
            <button className="sign-message-button" onClick={executeTx}>Execute Transaction</button>
            <button className="disconnect-button" onClick={() => disconnect()}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;