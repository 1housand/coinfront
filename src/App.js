import React, { Component } from 'react';
import { Timeline } from 'react-twitter-widgets'
import Chart from './Chart';
import { getData } from "./utils"
import { TypeChooser } from "react-stockcharts/lib/helper";

import Header from './components/Header';
import './App.css';
import _ from 'lodash';
// import { Line, Chart } from 'react-chartjs-2';
import moment from 'moment';
import coins from './supported-coins.json';

console.log(coins)

const REALTIME_BINANCE_URL = "https://api.binance.com"

class App extends Component {
  constructor (props) {
    super(props)

    // chart.js defaults
    Chart.defaults.global.defaultFontColor = '#000';
    Chart.defaults.global.defaultFontSize = 16;

    this.state = {historicalData: null, coin: "PHP", currency: "PHP"}
    this.onCoinSelect = this.onCoinSelect.bind(this)
  }

  componentDidMount () {
    this.getBitcoinData()
  }

  getBitcoinData () {
    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${this.state.coin}`)
      .then(response => response.json())
      .then(historicalData => this.setState({historicalData}))
      .catch(e => e)
  }

  getCoinData () {
    fetch(REALTIME_BINANCE_URL+'/api/v1/klines?symbol=QTUMBTC&interval=1h')
    // fetch('https://api.binance.com/api/v3/ticker/price', 
    // {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   mode: 'no-cors',
    //   body: JSON.stringify({
    //     symbol: 'QTUMBTC'
    //   })
    // })
      // .then(response => console.log(response.json()))
      // .then(response => response.json())
      .then(historicalData => this.setState({historicalData}))
      .catch(e => e)
  }

  formatChartData () {
    const {bpi} = this.state.historicalData

    return {
      labels: _.map(_.keys(bpi), date => moment(date).format("ll")),
      datasets: [
        {
          label: this.state.coin,
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: _.values(bpi)
        }
      ]
    }
  }

  setCoin (coin) {
    if (coin == "QTUM")
      this.setState({coin}, this.getCoinData)
    else
      this.setState({coin}, this.getBitcoinData)
  }

  onCoinSelect (e) {
    this.setCoin(e.target.value)
  }



  render() {
    if (this.state.historicalData) {
      return (
        <div className="app">
          <Header title="QTUM PRICE INDEX" />

          <div className="select-container">
            <span style={{fontSize: 18, fontFamily: 'Bungee'}}> Select your coin: </span>
            <select value={this.state.coin} onChange={this.onCoinSelect}>
              {coins.map((obj, index) =>
                <option key={`${index}-${obj.country}`} value={obj.coin}> {obj.coin} </option>
              )}
              {/* <option value="PHP">PHP</option>
              <option value="QTUM">QTUM</option> */}
            </select>
            {
              this.state.coin !== 'PHP' && (<div>
                <a href="#" className="link" onClick={() => this.setCoin('PHP')} style={{color: "black", fontSize: 16, fontFamily: 'Bungee'}}> [CLICK HERE TO RESET] </a>
              </div>)
            }
          </div>

          <div style={{marginTop: 10}}>
            {/* <Line data={this.formatChartData()} height={250} /> */}
            <TypeChooser>
				      {type => <Chart type={type} data={this.state.data} />}
			      </TypeChooser>
          </div>

          <div style={{marginTop: 10}}>
            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: 'qtumofficial'
              }}
              options={{
                username: 'TwitterDev',
                height: '600'
              }}
              onLoad={() => console.log('Timeline is loaded!')}

            />
          </div>
        </div>
      )
    }

    return null
  }
}

export default App;
