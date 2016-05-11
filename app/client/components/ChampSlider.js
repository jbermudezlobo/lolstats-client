import React from 'react';
import _ from 'lodash';

class ChampSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      images: this.props.images
    }
    this.changeImage = this.changeImage.bind(this);
    this.timer = setInterval(this.changeImage, 2000);
  }

  changeImage(){
    let curr = this.state.active;
    if(curr + 1 >= this.state.images.length) {
      curr = 0;
    } else {
      curr++;
    }
    this.setState({ active: curr });
  }

  fPoints(e){
    return e>=1e6?(e/1e6).toFixed(1).replace(/\.0$/,"")+"M":e>=1e3?(e/1e3).toFixed(1).replace(/\.0$/,"")+"K":e;
  }

  render() {
    let style = this.props.iconstyle;
    style.backgroundImage = `url(./img/tiers/${this.state.images[this.state.active].img}.png)`;
    return (
      <div className='mastery-icon' style={ style }>
        <div className='mastery-text'>
          {`#${this.state.active + 1} ${this.fPoints(this.state.images[this.state.active].points)}`}
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
