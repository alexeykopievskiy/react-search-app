/* eslint-disable react/jsx-first-prop-new-line */
import { createStore, applyMiddleware, compose } from 'redux';
/* eslint-enable global-require, react/jsx-first-prop-new-line */
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import rootReducer from '../reducers';
import DevTools from '../components/DevTools/DevTools';

const reduxRouterMiddleware = routerMiddleware(browserHistory);
const middleware = [
  reduxRouterMiddleware,
  thunk
].filter(Boolean);


function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&]+)\b/
      )
    )
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      /* eslint-disable global-require */
      const nextReducer = require('../reducers').default;
      /* eslint-enable global-require */
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default configureStore;
