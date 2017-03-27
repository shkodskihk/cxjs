import {Widget, VDOM} from '../Widget';
import {Store} from '../../data/Store';
import {Cx} from '../Cx';

export function startAppLoop(parentDOMElement, storeOrInstance, widget, options = {}) {

   if (!parentDOMElement || parentDOMElement.nodeType !== 1)
      throw new Error('First argument to startAppLoop should be a valid DOM element.');

   widget = Widget.create(widget);

   let store, instance;

   if (!storeOrInstance)
      storeOrInstance = new Store();

   if (storeOrInstance.notify)
      store = storeOrInstance;
   else if (storeOrInstance.getChild)
      instance = storeOrInstance;
   else
      throw new Error('Second argument to startAppLoop should be either of type Store or Instance');

   let root = <Cx store={store} widget={widget} instance={instance} options={options} subscribe={true}/>;

   VDOM.DOM.render(root, parentDOMElement);
   let stopped = false;

   return function () {
      if (stopped)
         return;

      stopped = true;

      if (!options.destroyDelay)
         destroy(parentDOMElement, options);
      else {
         setTimeout(() => {
            destroy(parentDOMElement, options);
         }, options.destroyDelay)
      }
   }
}

function destroy(parentDOMElement, options) {
   VDOM.DOM.unmountComponentAtNode(parentDOMElement);
   if (options.removeParentDOMElement && parentDOMElement.parentNode)
      parentDOMElement.parentNode.removeChild(parentDOMElement);
}