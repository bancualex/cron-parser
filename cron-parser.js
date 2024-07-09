const parseCron = (cronString) => {
    const [minute, hour, dayOfMonth, month, dayOfWeek, ...commandParts] = cronString.split(' ');
    const command = commandParts.join(' ');
  
    const parseField = (field, min, max) => {
      const result = [];
      if (field === '*') {
        for (let i = min; i <= max; i++) {
          result.push(i);
        }
      } else if (field.includes('/')) {
        const [base, step] = field.split('/');
        const start = base === '*' ? min : parseInt(base, 10);
        for (let i = start; i <= max; i += parseInt(step, 10)) {
          result.push(i);
        }
      } else if (field.includes('-')) {
        const [start, end] = field.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      } else if (field.includes(',')) {
        field.split(',').forEach(value => result.push(parseInt(value, 10)));
      } else {
        result.push(parseInt(field, 10));
      }
      return result;
    };
  
    const output = {
      'minute': parseField(minute, 0, 59),
      'hour': parseField(hour, 0, 23),
      'day of month': parseField(dayOfMonth, 1, 31),
      'month': parseField(month, 1, 12),
      'day of week': parseField(dayOfWeek, 0, 6),
      'command': [command]
    };
  
    return output;
  };
  
  const printOutput = (parsedCron) => {
    for (const [field, values] of Object.entries(parsedCron)) {
      console.log(field.padEnd(14) + values.join(' '));
    }
  };
  
  if (require.main === module) {
    const cronString = process.argv[2];
    const parsedCron = parseCron(cronString);
    printOutput(parsedCron);
  }
  
  module.exports = { parseCron, printOutput };