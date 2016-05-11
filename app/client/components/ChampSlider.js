import React from 'react';
import _ from 'lodash';
import champions from './../utils/champions.js';

class ChampSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      champs: this.props.images
    }
    this.changeImage = this.changeImage.bind(this);
    this.getChampionUrl = this.getChampionUrl.bind(this);
    this.timer = setInterval(this.changeImage, 4000);
  }

  changeImage(){
    let curr = this.state.active;
    if(curr + 1 >= this.state.champs.length) {
      curr = 0;
    } else {
      curr++;
    }
    this.setState({ active: curr });
  }

  getChampionUrl(id) {
    const champ = _.find(champions.data, (element) => element.id === id);
    return `http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/${champ.key}.png`;
  }

  fPoints(e){
    return e>=1e6?(e/1e6).toFixed(1).replace(/\.0$/,"")+"M":e>=1e3?(e/1e3).toFixed(1).replace(/\.0$/,"")+"K":e;
  }

  render() {
    let style = this.props.iconstyle;
    style.backgroundImage = `url(${ this.getChampionUrl(this.state.champs[this.state.active].champion_id) })`;
    return (
      <div className='mastery-icon' style={ style }>
        <div className='mastery-text'>
          {`#${this.state.active + 1} ${this.fPoints(this.state.champs[this.state.active].points)}`}
        </div>
      </div>
    )
  }

}

ChampSlider.propTypes = {
  images: React.PropTypes.array.isRequired,
  iconstyle: React.PropTypes.object.isRequired
}

export default ChampSlider;
