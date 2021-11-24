// SPDX-License-Identifier: MIT 
pragma solidity 0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Contract for decentalized file storage
/// @author Travis J. Thayer
contract EthStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _fileIds;
    
    address public owner;

    mapping(uint => File) private fileData;

    struct File {
        uint fileId;
        string fileName;
        string fileType;
        uint fileSize;
        uint dateUploaded;
        address fileOwner;
        string fileHash;
    }

    /// @notice Emitted when a file is uploaded
    /// @param fileId id assigned to the file
    /// @param fileName name user assigned to file
    /// @param fileOwner address of the uploader
    event FileUploaded (uint256 fileId, string fileName, address fileOwner);
    
    /// @notice modifier limiting access control to contract owner
    /// @dev could also use imported library (i.e., openzeppelin ownable)
    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the contract owner can call this function');
        _;
    }
    
    /// @notice constructor function - only called once on deployment
    /// @dev assigns contract owner to deployer
    /// @dev might be needed for certain administrative functions
    constructor() {
        owner = msg.sender;
    }
    
    /// @notice adds a file assigned to the account calling
    /// @param _fileName name given to file
    /// @param _fileHash hash value generated for file
    /// @param _fileType type of file
    /// @param _fileSize size of file
    function uploadFile(string memory _fileName, string memory _fileHash, string memory _fileType, uint _fileSize) public {
        /// @dev check data integrity for file upload
        /// @dev this could also be done on the frontend
        /// @dev added here to show the how and think about the why you would want to do in smart contract
        require(bytes(_fileName).length > 0, "fileName must have a value");
        require(bytes(_fileHash).length > 0, "fileHash must have a value");
        require(bytes(_fileType).length > 0, "fileType must have a value");
        require(_fileSize > 0, "fileSize must have a value");

        /// @dev limiting size for testing purposes to 100KB
        /// @dev can be combined with require statement above
        /// @dev can also be handled on the frontend
        require(_fileSize < 100000, "The file size is too large. Limited to 100 KB");
        
        /// @notice increment the fileId
        _fileIds.increment();
        /// @notice assign the fileId
        uint fileId = _fileIds.current();
        
        /// @notice add file to mapping
        fileData[fileId] = File(fileId, _fileName, _fileType, _fileSize, block.timestamp, msg.sender, _fileHash);

        /// @notice emit FileUploaded event
        emit FileUploaded(fileId, _fileName, msg.sender);
    }
  
    /// @notice retrieves all files for account caller
    function retrieveMyFiles() public view returns (File[] memory) {
        uint256 totalFileCount = _fileIds.current();
        uint256 myFileCount = 0;
        uint256 currentIndex = 0;
        
        /// @notice determine the number of files for address
        /// @dev this will be used to set the size of the array
        for (uint i = 1; i <= totalFileCount; i++) {
            if (fileData[i].fileOwner == msg.sender) {
                myFileCount++;
            }
        }
      
        /// @dev create a new array to hold the results
        File[] memory myFiles = new File[](myFileCount);
        /// @dev loop through files and add to array if fileOwner correct
        for (uint i = 1; i <= totalFileCount; i++) {
            if (fileData[i].fileOwner == msg.sender) {
                uint currentId = fileData[i].fileId;
                File memory currentFile = fileData[currentId];
                myFiles[currentIndex] = currentFile;
                currentIndex++;
            }
        }
      
        /// @dev return the array of files - each is a File struct
        return myFiles;
    }
    
    /*  
        The following functions have been added for testing purposes due to the nature of the contract. 
        These type of functions would not be present on a production version.
        However, other administrative functions might be present to contract owner such as upgradeability.
    */
    
    /// @notice function allowing contract owner to terminate contract functionality
    /// @dev added due to nature of contract
    /// @dev actual contract would not contain this functionality
    function destroyContract(address payable _to) public onlyOwner {
        selfdestruct(_to);
    }
    
    /// @notice allows contract owner to check file data
    /// @param _fileId fileId to pull data
    /// @dev only present for testing purposes
    /// @dev this type of function would not be present on production version
    function showFileData (uint256 _fileId) public onlyOwner view returns (File memory) {
        return fileData[_fileId];
    }
    
    /// @notice allows contract owner to check total files uploaded
    /// @dev only present for testing purposes
    /// @dev this type of function would not be present on production version
    function getTotalFiles() public view onlyOwner returns (uint256) {
        return _fileIds.current();
    }
}