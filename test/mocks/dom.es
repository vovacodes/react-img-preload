import { jsdom } from 'jsdom';

function create(domString) {

  const actualDOM = domString || '';
  global.document = jsdom(actualDOM);
  global.window = document.defaultView;
  global.Element = window.Element;
  global.navigator = {
    userAgent: 'node.js'
  };
}

export default { create };