// @flow

import { InteractionManager } from 'react-native';

const maxDefaultDelay = 500;

export default {
  ...InteractionManager,
  runAfterInteractions: (callback: () => void, maxDelay = maxDefaultDelay) => {
    // ensure callback get called, timeout at 500ms
    // https://github.com/facebook/react-native/issues/8624
    let called = false;
    console.log("Heyy BROOOOO");
    const timeout = setTimeout(() => {
      called = true;
      callback();
    }, maxDelay);
    InteractionManager.runAfterInteractions(() => {
      // already executed, don't do it twice
      if (called) {
        return;
      }
      // to be sure we don't have a race condition
      clearTimeout(timeout);

      // be sure to execute callback
      callback();
    });
  },
};
