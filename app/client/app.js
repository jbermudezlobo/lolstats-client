import React from 'react';
import ReactDOM from 'react-dom';

import Main from './components/Main';

const config = {
  appTitle: 'Stats',
  appContainer: 'statsApp',
  appDataContainer: 'styleData',
  styleData: {}
};

document.getElementsByTagName('title')[0] = config.appTitle;

config.styleData = JSON.parse(document.getElementById(config.appDataContainer).innerHTML);
document.getElementById(config.appDataContainer).innerHTML = "";

ReactDOM.render(<Main style={config.styleData}/>, document.getElementById(config.appContainer));
