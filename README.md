# Cron Expression Parser

This is a simple command line application that parses a cron string and expands each field to show the times at which it will run.

## Usage

To use this parser, you need to have Node.js installed. 

### Installation

1. Clone the repository or download the files.
2. Navigate to the project directory.

### Running the Parser

To run the parser, use the following command in the terminal:

```bash
node cron-parser.js "*/15 0 1,15 * 1-5 /usr/bin/find"