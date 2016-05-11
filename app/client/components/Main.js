import React from 'react';
import _ from 'lodash';
import ChampSlider from './ChampSlider';
// import stats from './../utils/simulated_stats';
import TierColors from './../utils/TierColors';

class Main extends React.Component {
  constructor(props) {
    super(props);
    const d = this.props.style.data;
    const customHeight = d.show_winrate || (!d.show_champion && !d.show_tier) ? '20px' : '30px';
    this.state = {
      visible: false,
      token: this.props.style.token,
      load_animation: d.load_animation,
      show_champion: d.show_champion,
      show_winrate: d.show_winrate,
      show_tier: d.show_tier,
      show_web: d.show_web,
      align: d.align,
      main: {
        backgroundColor: d.colors.back_color,
        borderColor: d.colors.back_border_color,
        borderWidth: d.borders.back_border_width,
        borderRadius: d.borders.back_border_radius,
        boxShadow: `${d.shadows.back_shadow} ${d.colors.back_shadow_color}`,
        textShadow: `${d.shadows.text_shadow} ${d.colors.text_shadow_color}`,
      },
      summoner: {
        lineHeight: customHeight,
        height: customHeight,
        color: d.colors.text_color
      },
      tier: {
        color: 'white',
        lineHeight: customHeight,
        height: customHeight,
      },
      mastery_icon: {
        borderColor: d.colors.champ_border_color,
        borderWidth: d.borders.champ_border_width,
        borderRadius: d.borders.champ_border_radius
      }
    };
    this.getStats = this.getStats.bind(this);
  };

  getStats() {
    /*
    const _stats = JSON.parse(stats);
    const tiercolor = (_.find(tierStyles, (elem) => elem.tier === _stats.stats.tier)).color;
    this.setState({
      visible: true,
      stats: _stats.stats,
      tier: {
        lineHeight: this.state.tier.lineHeight,
        height: this.state.tier.height,
        color: tiercolor
      }
    });*/
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
              <div style={{ position: 'absolute', left: '0px', top: '75px', fontSize: '13px', color: this.state.summoner.color }}>
                {'http://www.lobobot.com'}
              </div>
            ) : null
          }
        </div>
      )
    } else { return <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{ color: 'grey', margin: 20 }}></i>; }
  };
}

Main.propTypes = {
  style: React.PropTypes.object.isRequired
};

export default Main;
