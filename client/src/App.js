import EthStorageContract from './contractABIs/EthStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import { shortenAddress } from './utils/shortenAddress';
import './App.css';

// IPFS Connection
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentDidMount() {

    if(window.ethereum) {
      // update if user changes account
    window.ethereum.on('accountsChanged', this.accountChangedByUser);
      // update if user changes networks
    window.ethereum.on('chainChanged', this.chainChangedHandler);
    } else {
      window.alert("You need a web3 enabled browser");
    }
  }

  connectWalletHandler = () => {
    if(window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
            console.log("Account: ", result[0]);
            this.accountChangedHandler(result[0]);
        }) 
    } else {
        // setErrorMessage('Install Metamask');
        window.alert("You Need a web3 browser to use this dApp!");
    }
  }

  accountChangedHandler = (newAccount) => {
    console.log("accountChangedHandler called")
  
    this.account = newAccount;
    console.log("accountChangedHandler - setDefaultAccount: ", newAccount);
    this.setState({ connButtonText: 'Logout' })
    this.getContractInstance(newAccount);
  }

  accountChangedByUser = () => {
    // actions to take when user changes their Metamask account
    // for now we will simply reload the site
    window.location.reload();
  }

  chainChangedHandler = () => {
    // when user changes network in Metamask
    // reload the page
    window.location.reload();
  }

  disconnectWalletHandler = () => {
    console.log("disconnectWalletHandler called")

    this.setState({ account: null })
    window.location.reload();
  }

  getContractInstance = async (newAccount) => {

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    console.log("networkId: ", networkId);
    const deployedNetwork = EthStorageContract.networks[networkId];
    // console.log("deployedNetwork: ", deployedNetwork);
    
    // if not deployed alerts user
    if(deployedNetwork) {
      
      // if(true) { // modified to always make true to test hard coded contract address
      const instance = new web3.eth.Contract(EthStorageContract.abi, deployedNetwork.address);
      // testing hardocded address
      //const instance = new web3.eth.Contract(EthStorageContract.abi, '0x000');
      // console.log("contract instance: ", instance);
      // console.log("account: ", newAccount);

      // TODO: create new function for retrieving files
      // Get User Files - returns an array of files for connected account
    
      // testing simple contract interaction
      // const owner = await instance.methods.owner().call();
      // console.log("contract owner: ", owner);

      console.log("calling retrieve my files from account: ", newAccount)
      const userFiles = await instance.methods.retrieveMyFiles().call({from: newAccount});
      console.log("userFiles: ", userFiles)
      console.log("# of userFiles: ", userFiles.length)

      this.setState({ instance: instance, connected: true, userFiles: userFiles });
    
    } else {
      window.alert('Contract Not Deployed to this Network - Switch to Ropsten');
    }
  } 

  getUserFiles = async () => {
    console.log("getUserFiles called");
    // const userFiles = await instance.methods.retrieveMyFiles(newAccount).call();
  }

  // capture file data for upload
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      
      // console.log('buffer', this.state.buffer)
    }
  }


  // Upload File
  uploadFile = description => {
    console.log("Submitting file to IPFS...")
    this.setState({ account: this.account })

    //Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      // console.log('IPFS result: ', result)
      // console.log("Description: ", description)
      // console.log("File Name: ", this.state.name);
      // console.log("Hash: ", result[0].hash)
      // console.log("Current account: ", this.state.account)
      // console.log("File Type: ", this.state.type);
      // console.log("File Size: ", result[0].size);

      if(error) {
        console.error(error)
        return
      }

      // set state to loading
      this.setState({ loading: true, transactionText: 'Adding File to the Network' });

      // check file type
      if(this.state.type === '') {
        this.setState({ type: 'none' })
      }

      // upload function called
        this.state.instance.methods.uploadFile(description, result[0].hash, this.state.type, result[0].size)
        .send({ from: this.state.account })
        .then((response) => {
          console.log("response: ", response);
          this.setState({ loading: false });
          
          // reload data for updated display
          this.getContractInstance(this.state.account);
        })
        .catch((error) => {
          console.log('catch error called');
          console.log("error message: ", error.message);
          window.alert(error.message)
          this.setState({ loading: false })
          })
    
    })
  }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      instance: null,
      userFiles: [],
      connected: false,
      connButtonText: 'Login with Metamask',
      loading: false,
      transactionText: '',
      type: null,
      name: null,
      errorMessage: ''
    }

    //Bind functions
    this.uplodFile = this.uploadFile.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.account} />
        { this.state.connected
          ?  <div>
                <div className='text-center'>
                  <h4>You are connected with address: {shortenAddress(this.account)}</h4>
                  <button className="btn btn-primary" onClick={this.disconnectWalletHandler}>{this.state.connButtonText}</button>
                </div> 
                { this.state.loading 
                ? 
                    <div className="text-center">
                      <p>&nbsp;</p><p>&nbsp;</p>
                      <h5>{this.state.transactionText}</h5>
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                : 
                <Main
                  userFiles={this.state.userFiles}
                  captureFile={this.captureFile}
                  uploadFile={this.uploadFile}
                />
                }
              </div>
          : 
            <div>
              <div className='text-center'>
                <h4> {"Connect your Wallet to use EthStorage"} </h4>
                <button className="btn btn-primary" onClick={this.connectWalletHandler}>{this.state.connButtonText}</button>
                {this.errorMessage}
            </div>
            </div>
        }
      
      </div>
    );
  }
}

export default App;