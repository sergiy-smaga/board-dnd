import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { App } from '../App';
import store from '../redux/store';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

const AllTheProviders = (props: { children: JSX.Element[] | JSX.Element }) => {
  return <Provider store={store}>{props.children}</Provider>;
};

function renderApp() {
  return render(<App />, {
    wrapper: AllTheProviders,
  });
}

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = renderApp();
    expect(container).toBeTruthy();
  });
  it('should render the title', () => {
    const { getByText } = renderApp();
    expect(getByText('Task Board')).toBeInTheDocument();
  });
});
