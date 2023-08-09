// TakeAways to learn : Scoping in javascript.

const fs = require("fs/promises");

(async () => {

  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file"

  const createFunction = async (path) => {
    try {
      // we want to check whether or not we already have that file.
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();
      // we already have that file.
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      // we don't have that file, we should create it.
      const newFileHandle = await fs.open(path, 'w')
      console.log("A new file was successfully created !")
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
      try {
        await fs.unlink(path);
        console.log(`File deleted with name ${path}`);
      } catch (e) {
        console.log(e)
      }
  }

  const renameFile = async (newFilePath, oldFilePath) => {
    try {
      await fs.rename(oldFilePath, newFilePath)
    } catch (e) {
      console.log(e);
    }
  }

  const addToFile = async (filePath, content) => {
    try {
      await fs.writeFile(filePath, content)
    } catch(e) {
      console.log(e)
    }
  }
   

  const commandFileHandler = await fs.open("./command.txt", "r");
  const watcher = fs.watch("./command.txt");

  
  commandFileHandler.on("change", async () => {
    // get the size of file
    const size = (await commandFileHandler.stat()).size;
    //   allocate buffer with the size of the file
    const buff = Buffer.alloc(size);
    //   location at which we want to start filling our buffer
    const offset = 0;
    //   how many bites we want to read
    const lenght = buff.byteLength;
    //   The position that we want to start reading the file from.
    const position = 0;

    // we always want to read the whole content.
    await commandFileHandler.read(buff, offset, lenght, position);

    // decoder 01 -> meaningful
    // encoder meaningful = 01
    const command = buff.toString("utf-8");

    // create a file
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFunction(filePath);
    }

    // delete a file
    // delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath)
    }

    // rename the file:
    // rename the file <path> to <new-path>
    if(command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx)
      const newFilePath = command.substring(_idx + 4);

      renameFile(newFilePath, oldFilePath);
    }

    // add to the file:
    // add to the file <path> this content: <content>
    if(command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);

      addToFile(filePath, content) 
    }
  });

  //   Watcher
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
