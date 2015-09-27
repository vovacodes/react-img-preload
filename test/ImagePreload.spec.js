import dom from './mocks/dom.es';
import ImageMock from './mocks/Image.es';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react/addons';
import ImagePreload from '../src/ImagePreload.es'

const TestUtils = React.addons.TestUtils;

// enable DOM
dom.create('<html><body></body></html>');
global.Image = ImageMock;

class TestComponentWithSingleImage extends React.Component {

  render() {
    let { onPending, onLoaded, onError, examineProps, imgStatus } = this.props;

    switch (imgStatus) {
      case ImagePreload.STATUS_PENDING:
        onPending();
        break;
      case ImagePreload.STATUS_LOADED:
        onLoaded();
        break;
      case ImagePreload.STATUS_FAILED:
        onError();
        break;
    }

    examineProps && examineProps(this.props);

    return <noscript/>;
  }

}

class TestComponentWithMultipleImages extends React.Component {

  render() {
    let { onPending1, onPending2, onLoaded1, onLoaded2, onError1, onError2, firstImgStatus, secondImgStatus } = this.props;

    switch (firstImgStatus) {
      case ImagePreload.STATUS_PENDING:
        onPending1();
        break;
      case ImagePreload.STATUS_LOADED:
        onLoaded1();
        break;
      case ImagePreload.STATUS_FAILED:
        onError1();
        break;
    }

    switch (secondImgStatus) {
      case ImagePreload.STATUS_PENDING:
        onPending2();
        break;
      case ImagePreload.STATUS_LOADED:
        onLoaded2();
        break;
      case ImagePreload.STATUS_FAILED:
        onError2();
        break;
    }

    return <noscipt/>;
  }

}

const WrappedTestComponentWithSingleImage = ImagePreload(TestComponentWithSingleImage, ['img']);
const WrappedTestComponentWithMultipleImages = ImagePreload(TestComponentWithMultipleImages, ['firstImg', 'secondImg']);

describe('ImagePreload', () => {

  describe('when image src to preload in NOT specified', () => {

    it('should render provided component without any additional props', (done) => {
      let componentProps = {
        foo: 'foo',
        bar: 'bar',
        examineProps: (props) => {
          expect(props).to.be.deep.equal(componentProps);
          done();
        }
      };

      renderComponent(WrappedTestComponentWithSingleImage, componentProps);
    })

  });

  describe('when image src is specified and it is VALID', () => {

    it(`should render provided component with additional status prop, which should be PENDING initially, then resolved to LOADED`, (done) => {
      let onPending = sinon.spy();
      let onLoaded = sinon.spy();

      renderComponent(WrappedTestComponentWithSingleImage, {
        onPending: onPending,
        onLoaded: () => {
          onLoaded();
          runExpectations();
          done();
        },
        img: '/load-success.png'
      });

      function runExpectations() {
        expect(onPending.calledOnce).to.be.true;
        expect(onLoaded.calledOnce).to.be.true;
        expect(onPending.calledBefore(onLoaded)).to.be.true;
      }

    });

  });

  describe('when image src is specified and it is INVALID', () => {

    it('should render provided component with PENDING status, then resolve it to FAILED', (done) => {
      let onPending = sinon.spy();
      let onLoaded = sinon.spy();
      let onError = sinon.spy();

      renderComponent(WrappedTestComponentWithSingleImage, {
        onPending,
        onLoaded,
        onError: () => {
          onError();
          runExpectations();
          done();
        },
        img: '/load-fail.png'
      });

      function runExpectations() {
        expect(onPending.calledOnce).to.be.true;
        expect(onLoaded.notCalled).to.be.true;
        expect(onError.calledOnce).to.be.true;
        expect(onPending.calledBefore(onError)).to.be.true;
      }

    });

  });

  describe('when several images to preload are specified', () => {

    it('should render provided component with PENDING status of each image, then resolve them to LOADED or FAILED', (done) => {
      let onPending1 = sinon.spy();
      let onPending2 = sinon.spy();
      let onLoaded1 = sinon.spy();
      let onLoaded2 = sinon.spy();
      let onError1 = sinon.spy();
      let onError2 = sinon.spy();

      let imagesResolved = 0;

      renderComponent(WrappedTestComponentWithMultipleImages, {
        onPending1,
        onPending2,
        onLoaded1: () => {
          onLoaded1();
          runFirstImageExpectations();
          imagesResolved++;
          (imagesResolved === 2) && done();
        },
        onLoaded2,
        onError1,
        onError2: () => {
          onError2();
          runSecondImageExpectations();
          imagesResolved++;
          (imagesResolved === 2) && done();
        },
        firstImg: '/load-success.png',
        secondImg: '/load-fail.png'
      });

      function runFirstImageExpectations() {
        expect(onPending1.called).to.be.true;
        expect(onLoaded1.called).to.be.true;
        expect(onError1.notCalled).to.be.true;
        expect(onPending1.calledBefore(onLoaded1)).to.be.true;
      }

      function runSecondImageExpectations() {
        expect(onPending2.called).to.be.true;
        expect(onLoaded2.notCalled).to.be.true;
        expect(onError2.called).to.be.true;
        expect(onPending2.calledBefore(onError2)).to.be.true;
      }

    })

  });

});

function renderComponent(Component, props) {

  return TestUtils.renderIntoDocument(<Component {...props} />);
}