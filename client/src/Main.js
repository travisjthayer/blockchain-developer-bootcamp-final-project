import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto">
            <div className="content center">
              <p>&nbsp;</p>
              <div className="container-sm center" >
                <h4>Add Files to EthStorage</h4>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const description = this.fileDescription.value
                    this.props.uploadFile(description)
                  }} > 
                          <div className="mb-3">
                              <input
                                id="fileDescription"
                                type="text"
                                ref={(input) => { this.fileDescription = input }}
                                className="form-control"
                                placeholder="Enter a File Name..."
                                required />
                            <br />
                            <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={this.props.captureFile}  />
                          </div>
                          
                        <button type="submit" className="btn btn-primary">Upload File</button>
                        <div>&nbsp;</div>
                        <div><small>File size LIMITED to 100 KB for testing purposes. DO NOT upload personal files.  Files will NOT be retained.</small></div>
                  </form>
              </div>
              <p>&nbsp;</p>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">File Id</th>
                    <th scope="col">File Name</th>
                    <th scope="col">File Type</th>
                    <th scope="col">File Size</th>
                    <th scope="col">Date Uploaded</th>
                  </tr>
                </thead>
                { this.props.userFiles.map((file, key) => {
                  return(
                    <tbody key={key}>
                      <tr>
                        <th scope="row">{file.fileId}</th>
                        <td><a
                            href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">{file.fileName}</a>
                        </td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.dateUploaded).format('M/D/Y h:mm:ss A')}</td>
                      </tr>
                    </tbody>
                  )
                })}
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;