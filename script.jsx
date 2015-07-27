
var StarsFrame = React.createClass({
	render: function(){
		var NrStars = this.props.nrStars;
		var stars = [];
		for(i=0; i<NrStars; i++){
			stars.push(<span className="glyphicon glyphicon-star" aria-hidden="true"></span>);
		}
		return 	(
			<div id="stars_frame">
				<div className="well">
					{stars}
				</div>
			</div>
		)
	}
});

var ButtonFrame = React.createClass({
	render: function(){
		var equality = this.props.equality, button;

		switch(equality){
			case true:
				button = (<button className="btn btn-success btn-lg" onClick={this.props.addUsedNums}><span className="glyphicon glyphicon-ok"></span></button>);
				break;
			case false:
				button = (<button className="btn btn-danger btn-lg" onClick={this.props.checkSum}><span className="glyphicon glyphicon-remove"></span></button>);
				break;
			default:
				var disabled = (this.props.selected.length == 0);
				button = (<button className="btn btn-primary btn-lg" onClick={this.props.checkSum} disabled={disabled}>=</button>);
				break;
		}
		
		return 	(
			<div id="button_frame">
				{button}
				<button className="btn btn-warning btn-xs" onClick={this.props.reset} disabled={this.props.resetLimit < 1}><span className="glyphicon glyphicon-refresh"></span> &nbsp; {this.props.resetLimit}</button>
			</div>
		)
	}
});

var AnswerFrame = React.createClass({
	render: function(){
		var props = this.props;
		var spans = props.selected.map(function(item){
			return (
				<span onClick={props.deleteNr.bind(null, item)}>{item}</span>
			)
		})
		return 	(
			<div id="answer_frame">
				<div className="well">{spans}</div>
			</div>
		)
	}
});

var NumberFrame = React.createClass({
	render: function(){
		var numbers = [], 
			NrsClass, 
			SelectedNrs = this.props.selected,
			usedNums = this.props.usedNums;
		for(i=1; i<=9; i++){  // adds classes to numbers
			NrsClass = "nums selected-" + (SelectedNrs.indexOf(i)>=0);
			NrsClass += " used-" + (usedNums.indexOf(i)>=0);
			numbers.push(<div className={NrsClass} onClick={this.props.update.bind(null, i)}>{i}</div>)
		}
		return 	(
			<div id="number_frame">
				<div className="well">
					{numbers}
				</div>
			</div>
		)
	}
});

var Message = React.createClass({
	render: function(){
		return (
			<div id="message_frame">
				<div className="well text-center">
					<h2>{this.props.doneStatus}</h2>
					<button className="btn btn-success" onClick={this.props.resetGame}>Play again</button>
				</div>
			</div>
		)
	}
})

var Game = React.createClass({
	getInitialState: function(){
		return {
			selected: [], 
			nrStars: Math.floor(Math.random()*9) + 1,
			equality: null,
			usedNums: [],
			resetLimit: 9,
			doneStatus: null
		};
	},
	setStatus: function(mess){
		this.setState({
			doneStatus: mess
		})
	},
	updateSelected: function(num){
		if(this.state.selected.indexOf(num)<0){
			this.setState(
				{ selected: this.state.selected.concat(num), equality: null }
			)
		}
	},
	deleteSelected: function(num){
		var indx = this.state.selected.indexOf(num);
		this.state.selected.splice(indx, 1);
		this.setState(
			{ selected: this.state.selected, equality: null }
		)
	},
	checkSum: function(){
		var sumSelected = this.state.selected.reduce(function(a,b){return a + b}, 0);
        var isEqual = (sumSelected == this.state.nrStars);
        this.setState({ equality: isEqual });
	},
	addUsedNums: function(){
		var used = this.state.selected;
		this.setState({
			selected: [], 
			nrStars: Math.floor(Math.random()*9) + 1,
			equality: null,
			usedNums: this.state.usedNums.concat(used)
		}, function(){
			if(this.state.usedNums.length == 9){
				this.setStatus("You won!");
			}		
		})
	},
	resetStars: function(){
		if(this.state.resetLimit > 0){
			this.setState({
				nrStars: Math.floor(Math.random()*9) + 1,
				selected: [],
				equality: null,
				resetLimit: this.state.resetLimit - 1
			}, function(){
				if(this.state.resetLimit < 1){
					this.setStatus("Game Over!");
				}
			})
		}
	},
	resetGame: function(){
		this.replaceState(this.getInitialState());
	},
	render: function(){ 

		var bottomBox;
		if(this.state.doneStatus == null){  // renders either the numbers or the endgame message
			bottomBox = (<NumberFrame selected={this.state.selected} update={this.updateSelected} usedNums={this.state.usedNums} />);
		} else {
			bottomBox = (<Message resetGame={this.resetGame} doneStatus={this.state.doneStatus} />);
		}

		return 	(
			<div className="container">
				<h2> Play Nine </h2>
				<hr/>
				<div className="clearFix">
					<StarsFrame nrStars={this.state.nrStars} />
					<ButtonFrame selected={this.state.selected} 
								 checkSum={this.checkSum} 
								 equality={this.state.equality} 
								 addUsedNums={this.addUsedNums}
								 reset={this.resetStars}
								 resetLimit={this.state.resetLimit} />
					<AnswerFrame selected={this.state.selected} 
								 deleteNr={this.deleteSelected} />
				</div>
				{ bottomBox } 
			</div>
		)
	}
});

React.render(<Game />, document.getElementById("root"));

