const fs = require('fs');
const path = require('path');

// Function to get all text files in a directory
const getAllTextFiles = (dirPath) => {
  return fs.readdirSync(dirPath).filter(file => path.extname(file) === '.txt');
};

// Function to merge lines from multiple text files
const mergeLines = (dirPath) => {
  const textFiles = getAllTextFiles(dirPath);
  const allLines = new Set(); // Using Set to automatically handle duplicate lines

  textFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const lines = fileContent.split(/\r?\n/); // Split by line (handling both \r\n and \n)
    lines.forEach(line => {
      if (line.trim()) { // Avoid adding empty lines
        allLines.add(line.trim());
      }
    });
  });

  return Array.from(allLines);
};

// Directory path where the text files are located
const folderPath = './data'; // Replace with your folder path

// Merge lines from all text files and output the result
const mergedLines = mergeLines(folderPath);

// Optional: Write the merged lines to a new file
fs.writeFileSync(folderPath + '/all.txt', mergedLines.join('\n'), 'utf-8');
