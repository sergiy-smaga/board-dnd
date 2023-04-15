import React from 'react';
import { act, render, screen } from '@testing-library/react';
import SearchForm from '../components/SearchForm';
import userEvent from '@testing-library/user-event';
import * as reduxHooks from '../redux/hooks';

const useSelectorMock = reduxHooks.useAppSelector as jest.Mock;
const useDispatchMock = reduxHooks.useAppDispatch as jest.Mock;

const mockedPathname = '/some/path';
const mockAppState = {
  columnTasks: {
    pathname: mockedPathname,
    isLoading: false,
  },
};

jest.mock('../redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

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
    useDispatchMock.mockImplementation(() => () => {});
    useSelectorMock.mockImplementation((selector) => selector(mockAppState));
    render(<SearchForm />);
  });
  afterEach(() => {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });

  it('should have input', () => {
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
  it('should have submit button', () => {
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Load issues');
    expect(button).toBeDisabled();
  });
  it('input correct url', () => {
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    act(() => {
      userEvent.type(input, 'http://github.com');
    });
    expect(button).toBeEnabled();
  });
  it('submit form', () => {
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    act(() => {
      userEvent.type(input, 'http://github.com');
    });
    expect(button).toBeEnabled();
    act(() => {
      userEvent.click(button);
    });
    expect(useDispatchMock).toBeCalledTimes(1);
  });
});
