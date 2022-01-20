import React, { Component } from 'react';
import './App.css';

class Main extends Component {

    render() {
        return (
            <div className="container-fluid text-monospace main">
                <br></br>
                &nbsp;
                <br></br>
                <div className="row">
                    <div className="col-md-10">
                        <div className="vide-feed col-md-2 border border-secondary overflow-auto text-center" style={{ maxHeight: '4000px', minWidth: '175px' }}>
                            <h5 className="feed-title"><b>Upload Product</b></h5>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const serialNo = this.productSerialNo.value
                                const name = this.productName.value
                                const desc = this.productDesc.value
                                const price = this.productPrice.value
                                this.props.createProduct(serialNo, name, desc, price)
                            }} >
                                &nbsp;
                                <input type='file' accept=".jpg, .jpeg, .png .gif" onChange={this.props.captureProductImageFile} style={{ width: '250px' }} />
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="productSerialNo"
                                        type="text"
                                        ref={(input) => { this.productSerialNo = input }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="Serial No."
                                        required />
                                    <input
                                        id="productName"
                                        type="text"
                                        ref={(input) => { this.productName = input }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="Name"
                                        required />
                                    <input
                                        id="productDesc"
                                        type="text"
                                        ref={(input) => { this.productDesc = input }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="Description"
                                        required />
                                    <input
                                        id="productPrice"
                                        type="number"
                                        ref={(input) => { this.productPrice = input }}
                                        className="form-control-sm mt-3 mr-3"
                                        placeholder="Price"
                                        required />
                                </div>
                                <button type="submit" className="btn border border-dark btn-primary btn-block btn-sm">Create Product</button>
                                &nbsp;
                            </form>
                        </div>
                    </div>
                    <div className="col-md-10">
                        {this.props.products.map((product, key) => {
                            return (
                                <div className="card mb-4 text-center hover-overlay bg-secondary mx-auto" style={{ width: '195px' }} key={key} >
                                    <div className="card-title bg-dark">
                                        <small className="text-white"><b>{product.name}</b></small>
                                    </div>
                                    <div>
                                        <p>
                                            <img src={`https://ipfs.infura.io/ipfs/${product.hash}`} alt="Product"
                                                style={{ width: '170px' }}
                                            />
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
