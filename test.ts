import map from './dist';
import * as assert from 'assert';

interface TestDataItem {
  id: number;
  b: string;
  name: string;
  gender: string;
  family: string;
  mosquitoBites: number;
  nullableField: string | null;
}

const testData: TestDataItem[] = [
  { id: 1, b: 'Something', name: 'Steve', gender: 'male', family: 'deer', mosquitoBites: 430, nullableField: null },
  { id: 2, b: 'Something', name: 'Dave', gender: 'male', family: 'wolf', mosquitoBites: 98, nullableField: 'asdf' },
  { id: 3, b: 'Something', name: 'Mary', gender: 'female', family: 'deer', mosquitoBites: 254, nullableField: 'asdf' },
  { id: 4, b: 'Something', name: 'Margaret', gender: 'female', family: 'wolf', mosquitoBites: 178, nullableField: '' }
];

interface Test {
  fn: (data: TestDataItem[]) => any;
  result: any[] | ((data: TestDataItem[]) => any[]);
}

interface Tests {
  [key: string]: Test;
}

const tests: Tests = {
  'test mapping null': {
    fn: function (data) {
      return map(null, function (key, value, emit, end) {
        return "doesn't matter, this won't get processed";
      });
    },
    result: []
  },
  'test mapping undefined': {
    fn: function (data) {
      return map(undefined, function (key, value, emit, end) {
        return "doesn't matter, this won't get processed";
      });
    },
    result: []
  },
  'test mapping number': {
    fn: function (data) {
      return map(1, function (key, value, emit, end) {
        return "doesn't matter, this won't get processed";
      });
    },
    result: []
  },
  'test mapping string literal': {
    fn: function (data) {
      return map('hello world', function (key, value, emit, end) {
        return value;
      });
    },
    result: ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
  },
  'test mapping string object': {
    fn: function (data) {
      return map(new Object('hello world'), function (key, value, emit, end) {
        return value;
      });
    },
    result: ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
  },
  'test mapping array': {
    fn: function (data) {
      return map(data, function (key, value, emit, end) {
        return value;
      });
    },
    result: testData
  },
  'test mapping object': {
    fn: function (data) {
      return map({ a: 1, b: 2 }, function (key, value, emit, end) {
        return value;
      });
    },
    result: [1, 2]
  },
  'test mapping returning nulls': {
    fn: function (data) {
      return map(data, function (key, value, emit, end) {
        return null;
      });
    },
    result: [null, null, null, null]
  },
  'test mapping array with squash': {
    fn: function (data) {
      return map(data, function (key, value, emit, end) {
        return null;
      }, true);
    },
    result: []
  },
  'test mapping array with squash returning 0': {
    fn: function (data) {
      return map(data, function (key, value, emit, end) {
        return 0;
      }, true);
    },
    result: [0, 0, 0, 0]
  },
  'test mapping array with squash returning false': {
    fn: function (data) {
      return map(data, function (key, value, emit, end) {
        return false;
      }, true);
    },
    result: [false, false, false, false]
  }
};

const errors: Error[] = [];

map(tests, function (testName, test) {
  let thisSuccess = true;
  let result: any;

  process.stdout.write(testName);

  if (test.fn) {
    result = test.fn(testData);
  }

  try {
    assert.deepEqual(
      result,
      typeof test.result === 'function' ? test.result(testData) : test.result,
      'Failed ' + testName
    );
  } catch (e) {
    console.log(e);
    errors.push(e as Error);
    thisSuccess = false;
  }

  process.stdout.write(' .... ' + (thisSuccess ? green('Success') : red('Fail')) + '\n');
});

if (!errors.length) {
  console.log('\nAll tests passed');
} else {
  console.log('\nSomething failed');
  process.exit(1);
}

function red(text: string): string {
  return '\033[0;31;40m' + text + '\033[0m';
}

function green(text: string): string {
  return '\033[0;32;40m' + text + '\033[0m';
}
