import React from 'react';
import ReactDOM from 'react-dom';

import Stats from './components/Stats';

const config = {
  appTitle: 'Stats',
  appContainer: 'statsApp',
  appDataContainer: 'styleData',
  styleData: {}
};

document.getElementsByTagName('title')[0] = config.appTitle;

config.styleData = JSON.parse(document.getElementById(config.appDataContainer).innerHTML);
document.getElementById(config.appDataContainer).innerHTML = "";

ReactDOM.render(<Stats styleData={config.styleData}/>, document.getElementById(config.appContainer));
