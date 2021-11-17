/*=================================
=            FUNCTIONS            =
=================================*/
// window size function
function wndsize() {
	var w = 0;
	var h = 0;
	//IE
	if (!window.innerWidth) {
		if (!(document.documentElement.clientWidth == 0)) {
			//strict mode
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		} else {
			//quirks mode
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	} else {
		//w3c
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {
		width: w,
		height: h
	};
}

// map function
Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
	return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

/*=================================
=            VARIABLES            =
=================================*/
var doc = document,
	page = doc.getElementById('page'),
	timeAnim = 1.25;


/*========================================
=            REACT COMPONENTS            =
========================================*/


var Ripple = React.createClass({
	getInitialState: function() {
		return {
			x:"",
			y: "",
			w: wndsize().width,
			h: wndsize().height
		}
	},
	rippleAnim: function(event) {

		var dom 			= this.refs.ripple.getDOMNode(),
			greenDom 		= this.refs.greenripple.getDOMNode(),
			tl 				= new TimelineMax(),
			offsetX			= Math.abs( (this.state.w / 2) - event.pageX ),
			offsetY			= Math.abs( (this.state.h / 2) - event.pageY ),
			deltaX			= (this.state.w / 2) + offsetX,
			deltaY			= (this.state.h / 2) + offsetY,
			scale_ratio		= Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

		TweenMax.set([dom, greenDom], {transformOrigin: "center center"});

		tl
		.to(dom, timeAnim, {
			attr: {
				r: scale_ratio
			},
			ease: Power3.easeOut,
			onComplete: function() {
				classie.add(page, "orange");
			}
		})
		.to(dom, 2*timeAnim, {
			attr: {
				r: 32
			},
			delay: timeAnim/3,
			ease: Power0.easeNone
		})
		.to(greenDom, timeAnim/2, {
			attr: {
				r: scale_ratio
			},
			delay: timeAnim/3,
			ease: Power3.easeOut
		});
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.activity === "play") {

			switch(nextProps.point) {
				case "one":
					this.setState({
						x: nextProps.event.pageX,
						y: nextProps.event.pageY
					});
					this.rippleAnim(nextProps.event);
					break;
				case "two":
					var dom 			= this.refs.ripple.getDOMNode(),
						greenDom 		= this.refs.greenripple.getDOMNode(),
						tl 				= new TimelineMax(),
						offsetX			= Math.abs( (this.state.w / 2) - this.state.x ),
						offsetY			= Math.abs( (this.state.h / 2) - this.state.y ),
						deltaX			= (this.state.w / 2) + offsetX,
						deltaY			= (this.state.h / 2) + offsetY,
						scale_ratio		= Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

					tl
					.to(dom, timeAnim, {
						attr: {
							r: scale_ratio
						},
						onComplete: function() {
							classie.remove(page, "orange");
							TweenMax.set(greenDom, {
								attr: {
									r: 32
								}
							});
						},
						ease: Power3.easeOut
					})
					.to(dom, timeAnim/2, {
						attr: {
							r: 32
						},
						ease: Power3.easeOut
					});
					break;
			}
		}
	},
	render: function() {
		return (
			<svg height="1" width="1">
				<circle ref="greenripple" id="green_ripple" cx="0" cy="0" r="32" />
				<circle ref="ripple" id="white_ripple" cx="0" cy="0" r="32" />
			</svg>
		);
	}

});


var Button = React.createClass({
	handleClick: function(e) {
		var self = this;
		if (this.state.action === "paused") {
			this.setState({
				action: "play",
				point: "one",
				progress: 0,
				event: e.nativeEvent
			});
			var arrow 		= this.refs.arrow_icon.getDOMNode(),
				done 		= this.refs.done_icon.getDOMNode(),
				progress 	= this.refs.progress.getDOMNode(),
				tl 			= new TimelineMax();

			tl.fromTo(arrow, timeAnim, {
				yPercent: 0,
				autoAlpha: 1,
				scale: 1
			},{
				yPercent: 20,
				autoAlpha: 0,
				//delay: timeAnim/3,
				ease: Power3.easeOut
			})
			.fromTo(progress, 2*timeAnim/3, {
				yPercent: -20,
				autoAlpha: 0,
				scale: 0.6
			},{
				yPercent: 0,
				autoAlpha: 1,
				scale: 1,
				ease: Power3.easeOut
			}, "-="+timeAnim/3)
			.to(self.state, 2*timeAnim, {
				progress: 100,
				ease: Power0.easeNone,
				onUpdate: function(tween) {
					self.setState({
						progress: parseInt(tween.target.progress),
						action: "paused"
					})
				},
				onUpdateParams:["{self}"]
			})
			.to(progress, timeAnim/4, {
				yPercent: 20,
				autoAlpha: 0,
				scale: 0.6,
				delay: timeAnim/3,
				ease: Power3.easeOut
			})
			.fromTo(done, timeAnim/4, {
				yPercent: -20,
				autoAlpha: 0,
				scale: 0.6
			},{
				yPercent: 0,
				autoAlpha: 1,
				scale: 1,
				ease: Power3.easeOut
			})
			.to(done, 2*timeAnim/3, {
				yPercent: 20,
				autoAlpha: 0,
				scale: 0.6,
				delay: timeAnim/3,
				onStart: function() {
					self.setState({
						action: "play",
						point: "two",
						progress: 0,
						event: ""
					});
				},
				ease: Power3.easeOut
			})
			.fromTo(arrow, 2*timeAnim/3, {
				yPercent: -20,
				scale: 0.6,
				autoAlpha: 0
			},{
				yPercent: 0,
				scale: 1,
				autoAlpha: 1,
				delay: timeAnim/2,
				ease: Power3.easeOut,
				onComplete: function() {
					self.setState({
						action: "paused",
						point: "one",
						progress: 0,
						event: ""
					});
				}
			});
		}
	},
	getInitialState: function() {
		return {
			action: "paused",
			point:"",
			progress: 0,
			event: ""
		}
	},
	render: function() {
		return (
			<div className="material_button" onClick={this.handleClick}>
				<i ref="done_icon" className="material-icons done">done</i>
				<div ref="progress" className="progress">{this.state.progress}</div>
				<i ref="arrow_icon" className="material-icons">arrow_downward</i>
				<Ripple activity={this.state.action} event={this.state.event} point={this.state.point} />
			</div>
		);
	}

});

React.render(
	<Button />,
	page
);
