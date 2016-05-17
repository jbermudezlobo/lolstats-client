import React from 'react';
import _ from 'lodash';
import ChampSlider from './ChampSlider';
// import stats from './../utils/simulated_stats';
import TierColors from './../utils/TierColors';

class Main extends React.Component {
  static propTypes = {
    styleData: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.getStats = this.getStats.bind(this);
    this.rgbaToString = this.rgbaToString.bind(this);
    const d = this.props.styleData;
    const customHeight = d.show_winrate || (!d.show_champion && !d.show_tier) ? '20px' : '30px';
    this.state = {
      visible: false,
      token: d.token,
      load_animation: d.load_animation,
      show_champion: d.show_champion,
      show_winrate: d.show_winrate,
      show_tier: d.show_tier,
      show_web: d.show_web,
      align: d.align,
      main: {
        backgroundColor: this.rgbaToString(d.back_color),
        borderColor: this.rgbaToString(d.back_border_color),
        borderWidth: `${d.back_border_width}px`,
        borderRadius: `${d.back_border_radius}px`,
        boxShadow: `${this.shadowToString(d.back_shadow)} ${this.rgbaToString(d.back_shadow_color)}`,
        textShadow: `${this.shadowToString(d.text_shadow)} ${this.rgbaToString(d.text_shadow_color)}`
      },
      summoner: {
        lineHeight: customHeight,
        height: customHeight,
        color: this.rgbaToString(d.text_color)
      },
      tier: {
        color: 'white',
        lineHeight: customHeight,
        height: customHeight,
      },
      mastery_icon: {
        borderColor: this.rgbaToString(d.champ_border_color),
        borderWidth: `${d.champ_border_width}px`,
        borderRadius: `${d.champ_border_radius}%`
      }
    };
  };

  getStats() {
    console.log('Getting Stats...');
    fetch('/stats',{
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(!data.error) {
        const tiercolor = (_.find(TierColors, (elem) => elem.tier === data.stats.tier)).color;
        this.setState({
          visible: true,
          stats: data.stats,
          tier: {
            lineHeight: this.state.tier.lineHeight,
            height: this.state.tier.height,
            color: tiercolor
          }
        });
      } else {
        console.log('Error');
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  componentDidMount() {
    this.getStats();
    this.timer = setInterval(this.getStats, 30000);
  }

  rgbaToString(color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }

  shadowToString(shadow) {
    return `${shadow.h}px ${shadow.v}px ${shadow.b}px`;
  }

  render() {
    if (this.state.visible) {
      const percent = (this.state.stats.wins * 100 / (this.state.stats.wins + this.state.stats.losses)).toFixed(1);
      // const tiercolor = (_.find(TierColors, (elem) => elem.tier === this.state.stats.tier)).color;
      return (
        <div id='main' style={this.state.main} className={`animated ${this.state.load_animation}`}>
          {
            this.state.show_champion ?
              (
                <div className='col-left'>
                  <ChampSlider images={this.state.stats.champs} iconstyle={this.state.mastery_icon} />
                </div>
              ) : null
          }
          <div className='col-center'>
            <div className='summoner-container' style={{ textAlign: this.state.align }}>
              <div className='row' id='summoner-name' style={this.state.summoner}>{this.state.stats.name}</div>
              <div className='row' id='summoner-tier' style={this.state.tier}>
                {`${this.state.stats.tier} ${this.state.stats.division} ${this.state.stats.points}LP`}
              </div>
              {
                this.state.show_winrate ?
                  (
                    <div className='row' id='summoner-winratio'>
                      <span style={{ color: percent < 50 ? 'red' : '#39e600' }}>{percent}%</span>{' - '}
                      <span style={{ color: '#39e600' }}>{this.state.stats.wins}W</span>{' / '}
                      <span style={{ color: '#e60000' }}>{this.state.stats.losses}L</span>
                    </div>
                  ) : null
              }
            </div>
          </div>
          {
            this.state.show_tier ?
              (
                <div className='col-right'>
                  <div className='icon-container'>
                    <div id='tier-icon' style={{ backgroundImage: `url(./img/tiers/${this.state.stats.tier}.png)` }}></div>
                  </div>
                </div>
              ) : null
          }
          {
            this.state.show_web ?
            (
              <div style={{ position: 'absolute', left: '20px', top: '90px', fontSize: '13px', color: 'purple' }}>
                {'http://www.lobobot.com'}
              </div>
            ) : null
          }
        </div>
      )
    } else { return <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{ color: 'grey', margin: 20 }}></i>; }
  };
}

export default Main;
