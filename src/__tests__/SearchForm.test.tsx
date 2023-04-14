import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import store from '../redux/store';
import SearchForm from '../components/SearchForm';
import userEvent from '@testing-library/user-event';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchTasks } from '../redux/operations';
import { setPathname, setStorageTasks } from '../redux/columnTasksSlice';

jest.mock('../redux/operations', () => ({
  fetchTasks: jest.fn(),
}));
jest.mock('../redux/columnTasksSlice', () => ({
  setPathname: jest.fn(),
  setStorageTasks: jest.fn(),
}));

const mockedPathname = '/some/path';
const mockAppState = {
  columnTasks: {
    pathname: mockedPathname,
    isLoading: false,
  },
};

jest.mock('../redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockImplementation((callback) => {
    return callback(mockAppState);
  }),
}));

const AllTheProviders = (props: { children: JSX.Element[] | JSX.Element }) => {
  return <Provider store={store}>{props.children}</Provider>;
};

function renderForm() {
  return render(<SearchForm />, {
    wrapper: AllTheProviders,
  });
}
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe('SearchForm', () => {
  beforeEach(() => {
    renderForm();
  });
  beforeEach(() => {
    useAppSelector.mockImplementation((callback) => {
      return callback(mockAppState);
    });
  });
  afterEach(() => {
    useAppSelector.mockClear();
  });
  it('should have input', () => {
    const input = screen.getByPlaceholderText('Enter repo URL');
    expect(input).toBeInTheDocument();
  });
  it('should have submit button', () => {
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Load issues');
    expect(button).toBeDisabled();
  });
  it('input wrong url', () => {
    const input = screen.getByPlaceholderText('Enter repo URL');
    const button = screen.getByRole('button');
    userEvent.type(input, 'test');
    expect(button).toBeDisabled();
  });
  it('input correct url', () => {
    const input = screen.getByPlaceholderText('Enter repo URL');
    const button = screen.getByRole('button');
    userEvent.type(input, 'http://github.com');
    expect(button).toBeEnabled();
  });
  it('submit form', () => {
    const input = screen.getByPlaceholderText('Enter repo URL');
    const button = screen.getByRole('button');
    userEvent.type(input, 'http://github.com');
    expect(button).toBeEnabled();
    userEvent.click(button);
    expect(fetchTasks).toBeCalledTimes(1);
    expect(setPathname).toBeCalledTimes(1);
    expect(setStorageTasks).toBeCalledTimes(1);
  });
});
