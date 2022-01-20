import React, { Component } from 'react';
import DShopping from './abis/DShopping.json'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import Web3 from 'web3';
import './App.css';

// Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DShopping.networks[networkId]
    if (networkData) {
      const dShopping = new web3.eth.Contract(DShopping.abi, networkData.address)
      this.setState({ dShopping })
      const productsCount = await dShopping.methods.productCount().call()
      this.setState({ productsCount })
      // Load products, sort by newest
      for (var i = productsCount; i >= 1; i--) {
        const product = await dShopping.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('DShopping contract not deployed to detected network.')
    }
  }

  captureProductImageFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log('buffer', this.state.buffer);
    }
  }


  createProduct = (serialNo, name, desc, price) => {
    console.log("Submitting file to IPFS...");
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      this.state.dShopping.methods.createProduct(serialNo, name, desc, price, result[0].hash).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false });
      });
    });
  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dShopping: null,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this);
    this.captureProductImageFile = this.captureProductImageFile.bind(this);
  }

  render() {
    return (
      <div>
        <Header account={this.state.account} />
        {this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
            products={this.state.products}
            createProduct={this.createProduct}
            captureProductImageFile={this.captureProductImageFile}
          />
        }
        <Footer />
      </div>
    );
  }
}

export default App;