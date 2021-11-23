const { assert } = require('chai')

const StorageTest = artifacts.require('./EthStorage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('StorageTest - Chai Tests', ([deployer, user1, user2]) => {
  let instance

  before(async () => {
    instance = await StorageTest.deployed()
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
    let result

    // Details for test files to upload
    const fileName1 = 'Test File 1'
    const fileHash1 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType1 = 'pdf'
    const fileSize1 = 100

    const fileName2 = 'Test File 2'
    const fileHash2 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType2 = 'pdf'
    const fileSize2 = 100


    before(async () => {
        // upload 3 test files
        result = await instance.uploadFile(fileName1, fileHash1, fileType1, fileSize1, { from: user1 })
        result2 = await instance.uploadFile(fileName2, fileHash2, fileType2, fileSize2, { from: user2 })
        result3 = await instance.uploadFile('Test File 3', 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N', 'pdf', 100, { from: user1 })

        const file1 = await instance.showFileData(1)
        // console.log("Name of file 1: ", file1.fileName)
        // console.log("Owner of file 1: ", file1.owner)

        const file2 = await instance.showFileData(2)
        // console.log("Name of file 2: ", file2.fileName)
        // console.log("Owner of file 2: ", file2.owner)
    })
    /*
    it('added file', async () => {
        const total = instance.getTotalFiles()
        assert.equal(total, 1, 'File not uploaded')
    })
    */

    it('successfully uploads a file', async () => {
      const event = result.logs[0].args
      // console.log("event: ", event);
      assert.equal(event.fileId.toNumber(), 1, 'fileId is NOT correct')
      assert.equal(event.fileName, fileName1, 'fileName is NOT correct')
      assert.equal(event.fileOwner, user1, 'fileOwner is NOT correct')
    })

    it('successfully requires a file name', async () => {
        await instance.uploadFile('', 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N', { from: user1 }).should.be.rejected
    })

    it('successfully requires a file hash', async () => {
      await instance.uploadFile('Test File', '', { from: user1 }).should.be.rejected
    })
    
  })

  describe('TEST: checks the file data', async () => {
    
    const fileName1 = 'Test File 1'
    const fileHash1 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType1 = 'pdf'
    const fileSize1 = 100

    before(async () => {
        // upload a test file
        await instance.uploadFile(fileName1, fileHash1, fileType1, fileSize1, { from: user1 })
    })

    it('id of file is correct', async () => {
        const fileData = await instance.showFileData(1)
        assert.equal(fileData.fileId, 1, 'fileId is not correct')
    })

    it('name of file is correct', async () => {
      const fileData = await instance.showFileData(1)
      // assert.equal(fileData.fileId.toNumber(), 1, 'id is correct')
      assert.equal(fileData.fileName, fileName1, 'fileName is not correct')
    })

    it('owner of file is correct', async () => {
        const fileData = await instance.showFileData(1)
        assert.equal(fileData.fileOwner, user1, 'fileOwner is not correct')
    })
})

  describe('TEST: retrieve files', async () => {
    
    const fileName1 = 'Test File 1'
    const fileHash1 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType1 = 'pdf'
    const fileSize1 = 100

    const fileName2 = 'Test File 2'
    const fileHash2 = 'QmRdJLEoHPTnyGcK5e2hcLq4azMWw3gj8iuP43R6a5Gm9N'
    const fileType2 = 'pdf'
    const fileSize2 = 100

    before(async () => {
        // upload test files
        await instance.uploadFile(fileName1, fileHash1, fileType1, fileSize1, { from: user1 })
        await instance.uploadFile(fileName2, fileHash2, fileType2, fileSize2, { from: user1 })
    })

    it('successfully retrieves total files', async () => {
      totalFiles = await instance.getTotalFiles({ from: deployer })
      // console.log("totalFiles: ", totalFiles)

      // NOTE:  this is counting 6 files - 5 for user1 and 1 for user2 -  need to consolidate uploadFile functions
      // assert.equal(fileList.length, 5, 'Not properly listing files by account address')
    })

    it('successfully retrieves files by account address', async () => {
        // fileList = await instance.retrieveMyFiles({ from: user1 })
        fileList = await instance.retrieveMyFiles(user1)
        // console.log("fileList: ", fileList)
        // fileListLength = fileList.length 
        // console.log("# of Files: ", fileListLength)
        
        
        // NOTE:  this is counting 5 files for user1 -  need to consolidate uploadFile functions
        assert.equal(fileList.length, 5, 'Not properly listing files by account address')
    })

    /*
    it('successfully retrieves number of files by account address', async () => {
      numberOfFiles = await instance.getMyNumberOfFiles({ from: user1 })
      console.log("number of Files: ", numberOfFiles)
      
      // NOTE:  this is counting 5 files for user1 -  need to consolidate uploadFile functions
      // assert.equal(fileList.length, 5, 'Not properly listing files by account address')
    })
    */

  })

  describe('TEST: access control', async () => {
    /* - no longer returning a value
    it('allows owner to kill contract', async () => {
        const result = await instance.destroyContract(deployer, { from: deployer });
        assert.equal(result, true, 'kill function could not be called')
    })
    */
    it('prevents another account from calling function with onlyOwner modifier', async () => {
      await instance.getTotalFiles( { from: user1 } ).should.be.rejected
    })
  })
})