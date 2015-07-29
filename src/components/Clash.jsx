var React = require('react');
var _ = require('lodash');

var Tiles = require('./Tiles.jsx');
var Ammos = require('./Ammos.jsx');
var Players = require('./Players.jsx');
var Stats = require('./Stats.jsx');
var Shoots = require('./Shoots.jsx');

var deepSetState = require('../mixins/deepSetState.js');

var ClashJS = require('../clashjs/ClashCore.js');

var playerObjects = require('../Players.js');
var playerArray = _.map(playerObjects, el => el);

var Clash = React.createClass({
  mixins: [
    deepSetState
  ],

  getInitialState() {
    this.ClashJS = new ClashJS(playerArray, this.handleEvent);
    return {
      clashjs: this.ClashJS.getState(),
      shoots: []
    };
  },

  handleEvent(evt, data) {
    console.warn(evt, data, this.state.shoots);

    if (evt === 'SHOOT') {
      let newShoots = this.state.shoots.slice();
      newShoots.push({
        direction: data.direction,
        origin: data.origin.slice(),
        time: new Date().getTime()
      });

      this.setState({
        shoots: newShoots
      })
    }
  },

  componentDidMount() {
    this.setState({
      clashjs: this.ClashJS.nextPly()
    }, () => {
      window.setTimeout(() => {
        this.componentDidMount();
      }, 50);
    });
  },

  nextStep() {
    this.setState({
      clashjs: this.ClashJS.nextStep()
    });
  },

  render() {
    var {clashjs, shoots} = this.state;
    var {gameEnvironment, playerStates, playerInstances} = clashjs;

    return (
      <div className='clash' onClick={this.nextStep}>
        <Tiles
          gridSize={gameEnvironment.gridSize} />
        <Shoots
          shoots={shoots.slice()}
          gridSize={gameEnvironment.gridSize} />
        <Players
          gridSize={gameEnvironment.gridSize}
          playerInstances={playerInstances}
          playerStates={playerStates} />
        <Ammos
          gridSize={gameEnvironment.gridSize}
          ammoPosition={gameEnvironment.ammoPosition} />

        <Stats
          playerInstances={playerInstances}
          playerStates={playerStates} />

      </div>
    );
  }

});

module.exports = Clash;
