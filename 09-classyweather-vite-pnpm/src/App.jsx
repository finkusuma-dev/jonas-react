import React from 'react';
import { getWeather, formatDay } from './lib';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      city: '',
      weatherData: {},
      /* 
      weatherData : {
        "country": "Indonesia",
        "flag": "🇮🇩",
        "weather": [
          {
            "time": "Sat",
            "weather": "🌦",
            "temp_min": 25.7,
            "temp_max": 33.8
          },
          ...
        ]
      } */
    };
    this.handleInputText = this.handleInputText.bind(this);
    this.timeoutID = null;
  }

  handleInputText(e) {
    const city = e.target.value;
    this.setState((state) => ({
      ...state,
      city: city,
      weatherData: {},
    }));

    if (this.timeoutID != null) {
      // console.log(`clear timeout ID: ${this.timeoutID}`);
      clearTimeout(this.timeoutID);
    }
    this.timeoutID = setTimeout(async () => {
      this.setState((state) => ({
        ...state,
        isLoading: true,
      }));
      //console.log('request weather data');
      var results = await getWeather(city);
      this.setState((state) => ({
        ...state,
        weatherData: results,
        isLoading: false,
      }));
    }, 1000);
    // console.log(`interval ID: ${this.timeoutID}`);
  }

  render() {
    let weatherInfo = '';
    if (this.state.weatherData?.country) {
      weatherInfo = this.state.city && `${this.state.city}`;
      if (this.state.weatherData.country) {
        weatherInfo += ', ' + this.state.weatherData.country;
      }
      if (this.state.weatherData.flag) {
        weatherInfo += ' ' + this.state.weatherData.flag;
      }
    }

    return (
      <div className="app">
        <h1>Classy Weather</h1>
        {/* <h2>Test</h2> */}
        <input
          type="text"
          placeholder="Search for location"
          value={this.state.city}
          onChange={this.handleInputText}
        />

        {this.state.isLoading && <div>searching...</div>}
        {this.state.weatherData?.country && <h2>{weatherInfo}</h2>}
        {/* weatherInfo= Yogyakarta, Indonesia [flag] */}

        {/* <MyCounter/> */}
        <div className="weather">
          {this.state.weatherData?.weather &&
            this.state.weatherData?.weather?.map((e) => {
              return (
                <div
                  key={e.time}
                  className={`day ${
                    e.time === formatDay(new Date()) ? 'important' : ''
                  }`}
                >
                  <div>
                    <span>{e.weather}</span>
                  </div>
                  <div>{e.time}</div>
                  <div>{`${e.temp_max}° - ${e.temp_max}°`}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default App;
