import _ from 'lodash';
import '../css/style.css'

function component() {
    const element = document.createElement('div');
  
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'losoo'], ' ');
    return element;
  }

//document.body.appendChild(component());