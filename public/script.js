function wndsize() {
  var w = 0;
  var h = 0;
  if (!window.innerWidth) {
    if (!(document.documentElement.clientWidth == 0)) {
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else {
      w = document.body.clientWidth;
      h = document.body.clientHeight;
    }
  } else {
    w = window.innerWidth;
    h = window.innerHeight;
  }
  return {
    width: w,
    height: h };

}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

var doc = document,
page = doc.getElementById('page'),
timeAnim = 0.75;

var Ripple = React.createClass({ displayName: "Ripple",
  getInitialState: function () {
    return {
      x: "",
      y: "",
      w: wndsize().width,
      h: wndsize().height };
  },
  rippleAnim: function (event) {

    var dom = this.refs.ripple.getDOMNode(),
    greenDom = this.refs.greenripple.getDOMNode(),
    tl = new TimelineMax(),
    offsetX = Math.abs(this.state.w / 2 - event.pageX),
    offsetY = Math.abs(this.state.h / 2 - event.pageY),
    deltaX = this.state.w / 2 + offsetX,
    deltaY = this.state.h / 2 + offsetY,
    scale_ratio = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    TweenMax.set([dom, greenDom], { transformOrigin: "center center" });

    tl.
    to(dom, timeAnim, {
      attr: {
        r: scale_ratio 
      },
      ease: Power3.easeOut,
      onComplete: function () {
        classie.add(page, "orange");
      } 
    }).

    to(dom, 2 * timeAnim, {
      attr: {
        r: 256 
      },
      delay: timeAnim / 3,
      ease: Power0.easeNone 
    }).
    to(greenDom, timeAnim / 2, {
      attr: {
        r: scale_ratio 
      },
      delay: timeAnim / 3,
      ease: Power3.easeOut 
    });

  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.activity === "play") {
      switch (nextProps.point) {
        case "one":
          this.setState({
            x: nextProps.event.pageX,
            y: nextProps.event.pageY
          });
          this.rippleAnim(nextProps.event);
          break;
        case "two":
          var dom = this.refs.ripple.getDOMNode(),
          greenDom = this.refs.greenripple.getDOMNode(),
          tl = new TimelineMax(),
          offsetX = Math.abs(this.state.w / 2 - this.state.x),
          offsetY = Math.abs(this.state.h / 2 - this.state.y),
          deltaX = this.state.w / 2 + offsetX,
          deltaY = this.state.h / 2 + offsetY,
          scale_ratio = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          tl.
          to(dom, timeAnim, {
            attr: {
              r: scale_ratio 
            },
            onComplete: function () {
              classie.remove(page, "orange");
              TweenMax.set(greenDom, {
                attr: {
                  r: 256 
                } 
              });
            },
            ease: Power3.easeOut }).
          to(dom, timeAnim / 2, {
            attr: {
              r: 256 
            },
            ease: Power3.easeOut });
          break;}
    }
  },
  render: function () {
    return /*#__PURE__*/(
      React.createElement("svg", { height: "1", width: "1" }, /*#__PURE__*/
      React.createElement("circle", { ref: "greenripple", id: "green_ripple", cx: "0", cy: "0", r: "256" }), /*#__PURE__*/
      React.createElement("circle", { ref: "ripple", id: "white_ripple", cx: "0", cy: "0", r: "256" }))
      );
  } 
});

var Button = React.createClass({ displayName: "Button",
  handleClick: function (e) {
    var self = this;
    if (this.state.action === "paused") {
      this.setState({
        action: "play",
        point: "one",
        progress: 14,
        event: e.nativeEvent 
      });
      var arrow = this.refs.arrow_icon.getDOMNode(),
      done = this.refs.done_icon.getDOMNode(),
      progress = this.refs.progress.getDOMNode(),
      tl = new TimelineMax();
      tl.fromTo(arrow, timeAnim, {
        yPercent: 0,
        autoAlpha: 1,
        scale: 1 
      },
      {
        yPercent: 20,
        autoAlpha: 0,
        //delay: timeAnim/3,
        ease: Power3.easeOut 
      }).
      fromTo(progress, 2 * timeAnim / 3, {
        yPercent: -20,
        autoAlpha: 0,
        scale: 0.6 },
      {
        yPercent: 0,
        autoAlpha: 1,
        scale: 1,
        ease: Power3.easeOut },
      "-=" + timeAnim / 3).
      to(self.state, 2 * timeAnim, {
        progress: 14,
        ease: Power0.easeNone,
        onUpdate: function (tween) {
          self.setState({
            progress: parseInt(tween.target.progress),
            action: "paused" });

        },
        onUpdateParams: ["{self}"] }).

      to(progress, timeAnim / 4, {
        yPercent: 20,
        autoAlpha: 0,
        scale: 0.6,
        delay: timeAnim / 3,
        ease: Power3.easeOut }).

      fromTo(done, timeAnim / 4, {
        yPercent: -20,
        autoAlpha: 0,
        scale: 0.6 },
      {
        yPercent: 0,
        autoAlpha: 1,
        scale: 1,
        ease: Power3.easeOut }).

      to(done, 2 * timeAnim / 3, {
        yPercent: 20,
        autoAlpha: 0,
        scale: 0.6,
        delay: timeAnim / 3,
        onStart: function () {
          self.setState({
            action: "play",
            point: "two",
            progress: 14,
            event: "" 
          });
        },
        ease: Power3.easeOut }).

      fromTo(arrow, 2 * timeAnim / 3, {
        yPercent: -20,
        scale: 0.6,
        autoAlpha: 0 
      },
      {
        yPercent: 0,
        scale: 1,
        autoAlpha: 1,
        delay: timeAnim / 2,
        ease: Power3.easeOut,
        onComplete: function () {
          self.setState({
            action: "paused",
            point: "one",
            progress: 14,
            event: "" 
          });
        } });

    }
  },
  getInitialState: function () {
    return {
      action: "paused",
      point: "",
      progress: 14,
      event: "" };

  },
  render: function () {
    return (
      React.createElement("div", { className: "material_button", onClick: this.handleClick }, 
      React.createElement("i", { ref: "done_icon", className: "material-icons done" }, "done"), 
      React.createElement("div", { ref: "progress", className: "progress" }, this.state.progress), 
      React.createElement("i", { ref: "arrow_icon", className: "material-icons" }, "arrow_downward"), 
      React.createElement(Ripple, { activity: this.state.action, event: this.state.event, point: this.state.point }))
      );
  } });

React.render( 
  React.createElement(Button, null),
  page)
  ;