import React from 'react';
import _ from 'lodash';
import ajax from 'superagent';
import ChampSlider from './ChampSlider';
import TierColors from './utils/TierColors';

const colors = {
  lolblue: 'rgb(173, 170, 252)',
  green: 'rgb(143, 230, 148)',
  red: 'rgb(176, 58, 22)'
};

const outCols = {
  position: 'relative',
  float: 'left',
  width: '70px',
  height: '70px',
  marginRight: '-15px !important'
};

const centerCol = {
  margin: '5px',
  float: 'left',
  minWidth: '100px',
  padding: '0px'
};

class Stats extends React.Component {
  static propTypes = {
    styleData: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.styleData.token,
      visible: false,
      styleData: this.props.styleData,
    };
    this.getStatsAjax = this.getStatsAjax.bind(this);
    this.rgbaToString = this.rgbaToString.bind(this);
    this.shadowToString = this.shadowToString.bind(this);
  };

  getStatsAjax(){
    const currentdate = new Date().getTime();
    console.log('Getting stats at:', new Date());
    ajax
    .post('/actions/getstats.php')
    .send(`token=${this.state.token}`)
    .accept('json')
    .end((err, res) => {
      if (!err) {
        const _data = res.body;
        console.log(`Done (${new Date().getTime() - currentdate}ms)`);
        if(!_data.error) {
          this.setState({
            visible: true,
            stats: _data.stats,
          });
        } else {
          console.log('Error:', _data.error);
        }
      } else {
        console.log('Error:', err);
      }
    });
  }

  componentDidMount() {
    this.getStatsAjax();
    this.timer = setInterval(this.getStatsAjax, 20 * 60 * 1000);
  }

  rgbaToString(color) { return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`; }
  shadowToString(shadow) { return `${shadow.h}px ${shadow.v}px ${shadow.b}px`; }

  render() {
    if (this.state.visible) {

      const d = this.state.styleData;
      const customHeight = d.show_winrate || (!d.show_champion && !d.show_tier) ? '20px' : '30px';
      const cs = {
        main: {
          fontFamily: 'Montserrat',
          display: 'inline-block',
          border: 'solid',
          margin: '15px',
          backgroundColor: this.rgbaToString(d.back_color),
          borderColor: this.rgbaToString(d.back_border_color),
          borderWidth: `${d.back_border_width}px`,
          borderRadius: `${d.back_border_radius}px`,
          boxShadow: `${this.shadowToString(d.back_shadow)} ${this.rgbaToString(d.back_shadow_color)}`,
          textShadow: `${this.shadowToString(d.text_shadow)} ${this.rgbaToString(d.text_shadow_color)}`,
        },
        token: d.token,
        load_animation: d.load_animation,
        show_champion: d.show_champion,
        show_winrate: d.show_winrate,
        show_tier: d.show_tier,
        show_web: d.show_web,
        align: d.align,
        summoner: {
          lineHeight: customHeight,
          height: customHeight,
          color: this.rgbaToString(d.text_color)
        },
        tier: {
          color: (_.find(TierColors, (elem) => elem.tier === this.state.stats.tier)).color,
          lineHeight: customHeight,
          height: customHeight,
        },
        mastery_icon: {
          boxShadow: `${this.shadowToString(d.champ_shadow)} ${this.rgbaToString(d.champ_shadow_color)}`,
          borderColor: this.rgbaToString(d.champ_border_color),
          borderWidth: `${d.champ_border_width}px`,
          borderRadius: `${d.champ_border_radius}%`
        }
      };

      const percent = (this.state.stats.wins * 100 / (this.state.stats.wins + this.state.stats.losses)).toFixed(1);
      const champSection = cs.show_champion ?(<div style={ outCols }><ChampSlider images={this.state.stats.champs} iconstyle={cs.mastery_icon} /></div>) : null;
      const tierSection = cs.show_tier ? ( <div style={ outCols }> <div className='icon-container'> <div id='tier-icon' style={{ backgroundImage: `url(./img/tiers/${this.state.stats.tier}.png)` }}></div> </div> </div> ) : null;
      const winrateSection = cs.show_winrate ? ( <div className='row' id='summoner-winratio'> <span style={{ color: percent < 50 ? colors.red : colors.green }}>{percent}%</span>{' - '} <span style={{ color: colors.green }}>{this.state.stats.wins}W</span>{' / '} <span style={{ color: colors.red }}>{this.state.stats.losses}L</span> </div> ) : null;

      return (
        <div>
          <div id='main' style={cs.main} className={`animated ${cs.load_animation}`}>
            {champSection}
            <div style={ centerCol }>
              <div className='summoner-container' style={{ textAlign: cs.align }}>
                <div className='row' id='summoner-name' style={cs.summoner}>{this.state.stats.name}</div>
                <div className='row' id='summoner-tier' style={cs.tier}>
                  {`${this.state.stats.tier} ${this.state.stats.division} ${this.state.stats.points}LP`}
                </div>
                {winrateSection}
              </div>
            </div>
            {tierSection}
          </div>
          {
            cs.show_web ?
            (
              <div style={{ position: 'absolute', left: '20px', top: '0px', fontSize: '12px', color: 'grey', fontFamily: 'Montserrat' }}>
                {'www.lobobot.com'}
              </div>
            ) : null
          }
        </div>
      )
    } else { return <i className="fa fa-spinner fa-pulse fa-3x fa-fw" style={{ color: 'grey', margin: 20 }}></i>; }
  };
}

export default Stats;
