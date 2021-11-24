const { assert } = require('chai')

const StorageTest = artifacts.require('./EthStorage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('StorageTest - Chai Tests', ([deployer, user1, user2]) => {
  let instance 
  let fileName1, fileHash1, fileType1, fileSize1
  let fileName2, fileHash2, fileType2, fileSize2
  let fileName3, fileHash3, fileType3, fileSize3

  // deploy an instance of the contract
  // create 3 test files and upload for testing
  before(async () => {
    instance = await StorageTest.deployed()

    // Details for test files to upload
    fileName1 = 'Test File 1'
    fileHash1 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    fileType1 = 'pdf'
    fileSize1 = 100

    fileName2 = 'Test File 2'
    fileHash2 = 'QmdLcykTR4L39f8KXsSPd49SJ49zzsK6MovHkKmJ8saFcY'
    fileType2 = 'txt'
    fileSize2 = 250

    fileName3 = 'Test File 3'
    fileHash3 = 'QmWXbgxHvzPnUYFhJx61jz6rzLUXi4PNBq2w4mybLcNWq6'
    fileType3 = 'png'
    fileSize3 = 500

    // upload 3 test files - 2 from user1 and 1 from user2
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
        const total = await instance.getTotalFiles( {from: deployer } )
        assert.equal(total, 3, 'Test files not uploaded')
    })

    it('successfully requires a file name', async () => {
        await instance.uploadFile('', fileHash1, fileType1, fileSize1, { from: user1 }).should.be.rejected
    })

    it('successfully requires a file hash', async () => {
      await instance.uploadFile(fileName1, '', fileType1, fileSize1, { from: user1 }).should.be.rejected
    })

    it('successfully requires a file type', async () => {
      await instance.uploadFile(fileName1, fileHash1, '', fileSize1, { from: user1 }).should.be.rejected
    })

    it('successfully requires a file size', async () => {
      await instance.uploadFile(fileName1, fileHash1, fileType1, '', { from: user1 }).should.be.rejected
    })

    it('successfully rejects a large file', async () => {
      await instance.uploadFile(fileName1, fileHash1, fileType1, 100001, { from: user1 }).should.be.rejected
    })
    
  })

  describe('TEST: checking file data', async () => {

    it('id of file is correct', async () => {
        const fileData = await instance.showFileData(1, { from: deployer })
        assert.equal(fileData.fileId, 1, 'fileId is not correct')
    })

    it('name of file is correct', async () => {
      const fileData = await instance.showFileData(1)
      assert.equal(fileData.fileName, fileName1, 'fileName is not correct')
    })

    it('type of file is correct', async () => {
      const fileData = await instance.showFileData(1, { from: deployer })
      assert.equal(fileData.fileType, fileType1, 'fileType is not correct')
    })

    it('size of file is correct', async () => {
      const fileData = await instance.showFileData(1, { from: deployer })
      assert.equal(fileData.fileSize, fileSize1, 'fileSize is not correct')
    })

    it('hash of file is correct', async () => {
      const fileData = await instance.showFileData(1, { from: deployer })
      assert.equal(fileData.fileHash, fileHash1, 'fileHash is not correct')
    })

    it('owner of file is correct', async () => {
        const fileData = await instance.showFileData(1, { from: deployer })
        assert.equal(fileData.fileOwner, user1, 'fileOwner is not correct')
    })
})

  describe('TEST: retrieving files', async () => {

    it('successfully retrieves files by account address', async () => {
        const fileList = await instance.retrieveMyFiles(user1)
        // NOTE: only 2 Test files uploaded by user1 account
        assert.equal(fileList.length, 2, 'Not properly retrieving files by account address')
    })
  })

  describe('TEST: access control', async () => {

    it('prevents another account from calling function with onlyOwner modifier', async () => {
      await instance.getTotalFiles( { from: user1 } ).should.be.rejected
    })

  })
})