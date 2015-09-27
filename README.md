# react-img-preload
Higher-order React component for image preloading

Higher-order React component that allows to easily handle different loading states of images used in your component.
This could come in handy if you want to show something on the screen while the image is being loaded
or provide some default image if the desired one is failed to load. There might be different scenarios you could choose.
 
## Usage

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

var EnhancedComponent = ImagePreload(Component, ['img']);

React.render(
    React.createElement(EnhancedComponent, { img: 'http://38.media.tumblr.com/tumblr_lrbu1l9BJk1qgzxcao1_250.gif' }),
    document.getElementById('app')
);
```

