import { useState } from 'react';
import { isProduction } from '@rspress/shared';
import siteData from 'virtual-site-data';
import {
  DataContext,
  ThemeContext,
  normalizeRoutePath,
  BrowserRouter,
} from '@rspress/runtime';
import { isDarkMode } from '@theme';
import { App, initPageData } from './App';

const enableSSG = siteData.ssg;

// eslint-disable-next-line import/no-commonjs
const { default: Theme } = require('@theme');

export async function renderInBrowser() {
  const container = document.getElementById('root')!;
  const enhancedApp = async () => {
    const initialPageData = await initPageData(
      normalizeRoutePath(window.location.pathname),
    );
    return function RootApp() {
      const [data, setData] = useState(initialPageData);
      const [theme, setTheme] = useState<'light' | 'dark'>(
        // set the initial theme
        isDarkMode() ? 'dark' : 'light',
      );
      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <DataContext.Provider value={{ data, setData }}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </DataContext.Provider>
        </ThemeContext.Provider>
      );
    };
  };
  const RootApp = await enhancedApp();
  if (process.env.__IS_REACT_18__) {
    const { createRoot, hydrateRoot } = require('react-dom/client');
    if (isProduction() && enableSSG) {
      hydrateRoot(container, <RootApp />);
    } else {
      createRoot(container).render(<RootApp />);
    }
  } else {
    const ReactDOM = require('react-dom');
    if (isProduction()) {
      ReactDOM.hydrate(<RootApp />, container);
    } else {
      ReactDOM.render(<RootApp />, container);
    }
  }
}

renderInBrowser().then(() => {
  Theme.setup();
});
