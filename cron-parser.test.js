const { parseCron } = require('./cron-parser');

describe('Cron Parser', () => {
  // Happy Path Tests
  it('should parse cron expression with every 15 minutes correctly', () => {
    const cronString = '*/15 0 1,15 * 1-5 /usr/bin/find';
    const expectedOutput = {
      minute: [0, 15, 30, 45],
      hour: [0],
      'day of month': [1, 15],
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      'day of week': [1, 2, 3, 4, 5],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle single value fields correctly', () => {
    const cronString = '0 12 1 1 0 /usr/bin/find';
    const expectedOutput = {
      minute: [0],
      hour: [12],
      'day of month': [1],
      month: [1],
      'day of week': [0],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle range fields correctly', () => {
    const cronString = '0 0 1-5 1 0 /usr/bin/find';
    const expectedOutput = {
      minute: [0],
      hour: [0],
      'day of month': [1, 2, 3, 4, 5],
      month: [1],
      'day of week': [0],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle step fields correctly', () => {
    const cronString = '*/20 * * * * /usr/bin/find';
    const expectedOutput = {
      minute: [0, 20, 40],
      hour: [...Array(24).keys()],
      'day of month': [...Array(31).keys()].map((i) => i + 1),
      month: [...Array(12).keys()].map((i) => i + 1),
      'day of week': [...Array(7).keys()],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should parse cron expression with every 5 minutes and at minute 3 and 17', () => {
    const cronString = '*/5,3,17 * * * * /usr/bin/find';
    const expectedOutput = {
      minute: [0, 3, 5, 10, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55],
      hour: [...Array(24).keys()],
      'day of month': [...Array(31).keys()].map((i) => i + 1),
      month: [...Array(12).keys()].map((i) => i + 1),
      'day of week': [...Array(7).keys()],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should parse cron expression for every hour from 9 AM to 5 PM on weekdays and at 10 PM', () => {
    const cronString = '0 9-17,22 * * 1-5 /usr/bin/find';
    const expectedOutput = {
      minute: [0],
      hour: [9, 10, 11, 12, 13, 14, 15, 16, 17, 22],
      'day of month': [...Array(31).keys()].map((i) => i + 1),
      month: [...Array(12).keys()].map((i) => i + 1),
      'day of week': [1, 2, 3, 4, 5],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should parse cron expression for every minute in January and February on the 10th', () => {
    const cronString = '* * 10 * 1,2 /usr/bin/find';
    const expectedOutput = {
      minute: [...Array(60).keys()],
      hour: [...Array(24).keys()],
      'day of month': [10],
      month: [...Array(12).keys()].map((i) => i + 1),
      'day of week': [1, 2],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  it('should parse cron expression for every 10 minutes during the first half of the hour and every 15 minutes during the second half of the hour', () => {
    const cronString = '0-29/10,30-59/15 * * * * /usr/bin/find';
    const expectedOutput = {
      minute: [0, 10, 20, 30, 45],
      hour: [...Array(24).keys()],
      'day of month': [...Array(31).keys()].map((i) => i + 1),
      month: [...Array(12).keys()].map((i) => i + 1),
      'day of week': [...Array(7).keys()],
      command: ['/usr/bin/find'],
    };

    const result = parseCron(cronString);
    expect(result).toEqual(expectedOutput);
  });

  // Sad Path Tests
  it('should handle invalid minute field', () => {
    const cronString = '60 0 1 1 0 /usr/bin/find';
    expect(() => parseCron(cronString)).toThrow('Invalid minute field');
  });

  it('should handle invalid hour field', () => {
    const cronString = '0 24 1 1 0 /usr/bin/find';
    expect(() => parseCron(cronString)).toThrow('Invalid hour field');
  });

  it('should handle invalid day of month field', () => {
    const cronString = '0 0 0 1 0 /usr/bin/find';
    expect(() => parseCron(cronString)).toThrow('Invalid day of month field');
  });

  it('should handle invalid month field', () => {
    const cronString = '0 0 1 13 0 /usr/bin/find';
    expect(() => parseCron(cronString)).toThrow('Invalid month field');
  });

  it('should handle invalid day of week field', () => {
    const cronString = '0 0 1 1 7 /usr/bin/find';
    expect(() => parseCron(cronString)).toThrow('Invalid day of week field');
  });

  it('should handle missing command', () => {
    const cronString = '*/15 0 1,15 * 1-5';
    expect(() => parseCron(cronString)).toThrow('Missing command');
  });
});
