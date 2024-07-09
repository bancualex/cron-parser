const { validateField } = require('./validate-field');

const parseAsterisk = (min, max) => {
  const rangeLength = max - min + 1;

  const resultArray = Array(rangeLength)
    .fill()
    .map((_, index) => min + index);

  return resultArray;
};

const parseRange = (range, step = 1) => {
  const [start, end] = range.split('-').map(Number);
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

const parseStep = (base, step, min, max) => {
  const start = base === '*' ? min : parseInt(base, 10);
  const result = [];
  for (let i = start; i <= max; i += parseInt(step, 10)) {
    result.push(i);
  }
  return result;
};

const parseList = (list, min, max) => {
  const result = list.split(',').reduce((acc, part) => {
    const parsedPart = parseField(part, min, max);

    return acc.concat(parsedPart);
  }, []);

  return [...new Set(result)].sort((a, b) => a - b);
};

const parseField = (field, min, max) => {
  if (field.includes(',')) {
    return parseList(field, min, max);
  }
  if (field.includes('/')) {
    const [base, step] = field.split('/');

    if (base.includes('-')) {
      const [start, end] = base.split('-').map(Number);

      return parseStep(base, step, start, end);
    }

    return parseStep(base, step, min, max);
  }
  if (field.includes('-')) {
    return parseRange(field);
  }
  if (field === '*') {
    return parseAsterisk(min, max);
  }
  return [parseInt(field, 10)];
};

const parseCron = (cronString) => {
  const [minute, hour, dayOfMonth, month, dayOfWeek, ...commandParts] =
    cronString.split(' ');
  if (commandParts.length === 0) throw new Error('Missing command');

  const command = commandParts.join(' ');

  validateField(minute, 0, 59, 'minute');
  validateField(hour, 0, 23, 'hour');
  validateField(dayOfMonth, 1, 31, 'day of month');
  validateField(month, 1, 12, 'month');
  validateField(dayOfWeek, 0, 6, 'day of week');

  const output = {
    minute: parseField(minute, 0, 59),
    hour: parseField(hour, 0, 23),
    'day of month': parseField(dayOfMonth, 1, 31),
    month: parseField(month, 1, 12),
    'day of week': parseField(dayOfWeek, 0, 6),
    command: [command],
  };

  return output;
};

const printOutput = (parsedCron) => {
  Object.entries(parsedCron).forEach((entry) => {
    const [field, values] = entry;
    console.log(field.padEnd(14) + values.join(' '));
  });
};

// Entry point for the script
// Run the code only if the script is being run directly an not if it is imported as a module
if (require.main === module) {
  const cronString = process.argv[2];
  const parsedCron = parseCron(cronString);
  printOutput(parsedCron);
}

module.exports = { parseCron };
