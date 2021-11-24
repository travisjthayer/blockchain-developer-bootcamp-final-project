const { assert } = require('chai')

const StorageTest = artifacts.require('./EthStorage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('StorageTest - Chai Tests', ([deployer, user1, user2]) => {
  let instance 
  let fileName1, fileHash1, fileType1, fileSize1

  // deploy an instance of the contract
  // create 2 test files and upload for testing
  before(async () => {
    instance = await StorageTest.deployed()

    // Details for test files to upload
    fileName1 = 'Test File 1'
    fileHash1 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    fileType1 = 'pdf'
    fileSize1 = 100

    const fileName2 = 'Test File 2'
    const fileHash2 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType2 = 'txt'
    const fileSize2 = 250

    const fileName3 = 'Test File 3'
    const fileHash3 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType3 = 'png'
    const fileSize3 = 500

    // upload 3 test files - 2 from user1 and 1 from user 2
    await instance.uploadFile(fileName1, fileHash1, fileType1, fileSize1, { from: user1 })
    await instance.uploadFile(fileName2, fileHash2, fileType2, fileSize2, { from: user2 })
    await instance.uploadFile(fileName3, fileHash3, fileType3, fileSize3, { from: user1 })

  })

  describe('TEST: deployment', async () => {
    it('deploys successfully', async () => {
      const address = await instance.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('successfully sets owner account', async () => {
      const owner = await instance.owner()
      assert.equal(owner, deployer, 'Owner account not correctly set')
    })
  })

  describe('TEST: uploading files', async () => {
 
    it('successfully uploads the test files', async () => {
        const total = await instance.getTotalFiles( {from: deployer })
        assert.equal(total, 3, 'Test files not uploaded')
    })

    it('successfully requires a file name', async () => {
        await instance.uploadFile('', fileHash1, fileType1, fileSize1, { from: user1 }).should.be.rejected
    })

    it('successfully requires a file hash', async () => {
      await instance.uploadFile(fileName1, '', { from: user1 }).should.be.rejected
    })
    
  })

  describe('TEST: checks the file data', async () => {

    it('id of file is correct', async () => {
        const fileData = await instance.showFileData(1, { from: deployer })
        assert.equal(fileData.fileId, 1, 'fileId is not correct')
    })

    it('name of file is correct', async () => {
      const fileData = await instance.showFileData(1)
      assert.equal(fileData.fileName, 'Test File 1', 'fileName is not correct')
    })

    it('owner of file is correct', async () => {
        const fileData = await instance.showFileData(1)
        assert.equal(fileData.fileOwner, user1, 'fileOwner is not correct')
    })
})

  describe('TEST: retrieve files', async () => {

    it('successfully retrieves files by account address', async () => {
        const fileList = await instance.retrieveMyFiles(user1)
        // NOTE: 2 Test files uploaded using user1
        assert.equal(fileList.length, 2, 'Not properly listing files by account address')
    })
  })

  describe('TEST: access control', async () => {

    it('prevents another account from calling function with onlyOwner modifier', async () => {
      await instance.getTotalFiles( { from: user1 } ).should.be.rejected
    })

  })
})