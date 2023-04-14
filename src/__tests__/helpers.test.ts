import {
  getColumnName,
  getFromLocalStorage,
  getItemStyle,
  getListStyle,
  move,
  reorder,
  setToLocalStorage,
} from '../helpers';
import { ColumnType, IssueState } from '../redux/types';

const taskByDefault = {
  id: 1,
  title: 'test',
  number: 1,
  created_at: '2020-01-01',
  comments: 1,
};

describe('getColumnName', () => {
  it('should return ColumnType.TO_DO', () => {
    const task = {
      state: IssueState.OPEN,
      assignee: null,
      ...taskByDefault,
    };
    expect(getColumnName(task)).toBe(ColumnType.TO_DO);
  });
  it('should return ColumnType.IN_PROGRESS', () => {
    const task = {
      state: IssueState.OPEN,
      assignee: { login: 'test' },
      ...taskByDefault,
    };
    expect(getColumnName(task)).toBe(ColumnType.IN_PROGRESS);
  });
  it('should return ColumnType.DONE', () => {
    const task = {
      state: IssueState.CLOSED,
      assignee: null,
      ...taskByDefault,
    };
    expect(getColumnName(task)).toBe(ColumnType.DONE);
  });
});

const localStorageMock = (function () {
  const store = {};
  return {
    getItem(key: string) {
      return store[key];
    },
    setItem(key: string, value: any) {
      store[key] = value;
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('set and get to LocalStorage ', () => {
  test('data is added into local storage', () => {
    const mockId = '1';
    const mockJson = { data: 'json data' };
    setToLocalStorage(mockJson, mockId);
    expect(localStorage.getItem(mockId)).toEqual(JSON.stringify(mockJson));
  });

  test('data is added into local storage', () => {
    const mockId = '1';
    const mockJson = { data: 'json data' };
    setToLocalStorage(mockJson, mockId);

    const result = getFromLocalStorage(mockId);
    expect(result).toEqual(mockJson);
  });
});

describe('reorder', () => {
  it('should return reordered array', () => {
    const list = [1, 2, 3, 4, 5];
    const startIndex = 1;
    const endIndex = 3;
    const result = [1, 3, 4, 2, 5];
    expect(reorder(list, startIndex, endIndex)).toEqual(result);
  });
});

describe('move', () => {
  it('should return moved array', () => {
    const source = [1, 2, 3, 4, 5];
    const destination = [6, 7, 8, 9, 10];
    const droppableSource = {
      index: 1,
      droppableId: '1',
    };
    const droppableDestination = {
      index: 3,
      droppableId: '2',
    };
    const result = {
      1: [1, 3, 4, 5],
      2: [6, 7, 8, 2, 9, 10],
    };
    expect(
      move(source, destination, droppableSource, droppableDestination)
    ).toEqual(result);
  });
});

const resultStyle = {
  padding: 8,
  width: 250,
  minHeight: 800,
  borderRadius: 15,
  border: '2px solid gray',
  textAlign: 'center',
};

describe('getListStyle', () => {
  it('should return style', () => {
    const isDraggingOver = true;
    const result = {
      background: 'skyblue',
      ...resultStyle,
    };
    expect(getListStyle(isDraggingOver)).toEqual(result);
  });
  it('should return style', () => {
    const isDraggingOver = false;
    const result = {
      background: '#ccc',
      ...resultStyle,
    };
    expect(getListStyle(isDraggingOver)).toEqual(result);
  });
});

const commonStyle = {
  userSelect: 'none',
  borderRadius: 20,
  border: '1px solid black',
  boxShadow: '2px 1px 2px black',
  marginBottom: 10,
};
const draggableStyle = {
  color: 'red',
};

describe('getItemStyle', () => {
  it('should return style', () => {
    const isDragging = true;
    const result = {
      opacity: 0.2,
      background: 'yellow',
      ...commonStyle,
      ...draggableStyle,
    };
    expect(getItemStyle(isDragging, draggableStyle)).toEqual(result);
  });
  it('should return style', () => {
    const isDragging = false;
    const result = {
      opacity: 1,
      background: '#aaa',
      ...commonStyle,
      ...draggableStyle,
    };
    expect(getItemStyle(isDragging, draggableStyle)).toEqual(result);
  });
});
