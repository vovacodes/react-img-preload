# react-img-preload
Higher-order React component for image preloading

[![NPM](https://nodei.co/npm/react-img-preload.png)](https://nodei.co/npm/react-img-preload/)

Higher-order React component that allows to easily handle different loading states of images used in your component.
This could come in handy if you want to show something on the screen while the image is being loaded
or provide some default image if the desired one is failed to load. There might be different scenarios you could choose.
 
## Usage

### Install 

```sh
npm install --save react-img-preload
```

### Example

```js
// EnhancedComponent.js
var React = require('react');
var ImagePreload = require('react-img-preload');

var Component = React.createClass({
  render: function render() {
    var content;
    
    if (this.props.imgStatus === ImagePreload.STATUS_PENDING) {
    
      // Render something to show that image is loading
      content = <div>Image is loading...</div>;
    } else if (this.props.imgStatus === ImagePreload.STATUS_LOADED) {
    
      // Image is loaded, render it
      content = <img src={this.props.img} >
    } else if (this.props.imgStatus === ImagePreload.STATUS_FAILED) {
    
      // Image is failed to load, render default one instead
      content = <img src="http://dummyimage.com/600x400/000/fff&text=Default+image">
    }

    return content;
  }
});

// ImagePreload will know that it should preload image with src specified via "img" prop.
// It will update the loading status of the image through imgStatus prop.
var EnhancedComponent = ImagePreload(Component, ['img']);

React.render(
    <EnhancedComponent img="http://38.media.tumblr.com/tumblr_lrbu1l9BJk1qgzxcao1_250.gif"/>,
    document.getElementById('app')
);
```

## API

### `ImagePreload(Component, imagePreloadPropNames)`
Wraps `Component` into new component that handles image preloading.
It doesn't modify the original `Component`, but returns a new one.
All the props passed to new enhanced component will be passed down to the original `Component`.

All props with the names specified in `imagePreloadPropNames` array will be treated as source urls of images to preload.

The counterpart prop with `Status` postfix will be created for all of them, in order to be able to track the loading status of every individual image. So if `'img'` is specified as a propName for preload, the `imgStatus` prop will be created and passed down to the original `Component` by the wrapper.  
`imgStatus` may have one of the following self-describing values, that represent current status of image loading:

- `ImagePreload.STATUS_PENDING`
- `ImagePreload.STATUS_LOADED`
- `ImagePreload.STATUS_FAILED`
