import React from 'react';

function ImagePreload(Component, imagePreloadPropNames) {
  class ImagePreloadComponent extends React.Component {

    constructor(props) {
      super(props);
      this.images = {};
      const state = {};

      imagePreloadPropNames
          .filter((imageName) => this.props[imageName])
          .forEach((imageName) => {
            this.preloadImage(imageName, this.props[imageName]);
            state[imageName + 'Status'] = ImagePreload.STATUS_PENDING;
          });

      this.state = state;
    }

    componentWillReceiveProps(nextProps) {
      const nextState = {};

      imagePreloadPropNames
          .filter((imageName) => this.props[imageName] !== nextProps[imageName])
          .forEach((imageName) => {
            if (!nextProps[imageName]) {
              this.removeImageFromCache(imageName);
              nextState[imageName + 'Status'] = null;
              return;
            }

            this.preloadImage(imageName, this.props[imageName]);
            nextState[imageName + 'Status'] = ImagePreload.STATUS_PENDING;
          });

      if (!isEmpty(nextState)) this.setState(nextState);
    }

    onImageLoad(imageName) {
      this.setState({
        [imageName + 'Status']: ImagePreload.STATUS_LOADED
      });
    }

    onImageError(imageName) {
      this.setState({
        [imageName + 'Status']: ImagePreload.STATUS_FAILED
      });
    }

    removeImageFromCache(imageName) {
      const image = this.images[imageName];

      if (!image) return;

      image.onload = null;
      image.onerror = null;
      delete this.images[imageName];
    }

    preloadImage(imageName, imageSrc) {
      const image = new Image();

      image.onload = () => this.onImageLoad(imageName);
      image.onerror = () => this.onImageError(imageName);
      image.src = imageSrc;

      this.images[imageName] = image;
    }

    render() {
      return <Component {...this.props} {...this.state}/>;
    }

  }

  return ImagePreloadComponent;
}

ImagePreload.STATUS_PENDING = 'PENDING';
ImagePreload.STATUS_LOADED = 'LOADED';
ImagePreload.STATUS_FAILED = 'FAILED';

function isEmpty(object) {
  return !object || Object.keys(object).length === 0;
}

export default ImagePreload;
