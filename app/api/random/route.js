import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Helper to get random index, excluding previous ones
function getRandomIndex(length, excludedIndices = []) {
  const availableIndices = Array.from({ length }, (_, i) => i).filter(i => !excludedIndices.includes(i));
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return randomIndex;
}

async function readData(fileName = 'oblique-strategies') {
  // Get the file path to the strategies text file
  const filePath = path.join(process.cwd(), 'data', fileName + '.txt');

  // Read the content of the text file
  const fileContents = await fs.readFile(filePath, 'utf-8');

  // Split the file contents by line to create an array of strategies
  const strategies = fileContents.split('\n').filter(Boolean); // Remove empty lines
  return strategies
}

export async function GET() {
  try {
    const strategies = await readData()

    // Select a random strategy
    const randomIndex = getRandomIndex(strategies.length);
    const randomStrategy = strategies[randomIndex];

    // Return the random strategy as JSON
    return NextResponse.json({ strategy: randomStrategy, index: randomIndex });
  } catch (error) {
    console.error('Error reading strategies file:', error);
    return NextResponse.json({ error: 'Failed to load strategies' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    // Get the list of previously used indexes from the request body
    const body = await req.json();
    const { usedIndexes = [] } = body; // Default to an empty array if none provided

    const strategies = await readData()

    // Check if all strategies have been used
    if (usedIndexes.length >= strategies.length) {
      return NextResponse.json({ error: 'All strategies have been used.' }, { status: 400 });
    }

    // Get a random index that hasn't been used yet
    const randomIndex = getRandomIndex(strategies.length, usedIndexes);

    // Get the strategy at the random index
    const randomStrategy = strategies[randomIndex];

    // Return the random strategy along with its index
    return NextResponse.json({ strategy: randomStrategy, index: randomIndex });
  } catch (error) {
    console.error('Error reading strategies file:', error);
    return NextResponse.json({ error: 'Failed to load strategies' }, { status: 500 });
  }
}