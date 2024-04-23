import React from 'react';
import PropTypes from 'prop-types';
import { getWeather } from './lib';

class App extends React.Component {
  state = {
    isLoading: false,
    city: '',
    weatherData: {},
    /* 
    weatherData : {
      "country": "Indonesia",
      "flag": "🇮🇩",
      "weather": [
        {
          "day": "Sat",
          "icon": "🌦",
          "temp_min": 25.7,
          "temp_max": 33.8
        },
        ...
      ]
    } */
  };

  constructor(props) {
    super(props);

    this.timeoutID = null;
  }

  handleInputText = (e) => {
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
  };

  buildLocationInfo = () => {
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
    return weatherInfo;
  }

  render() {
    let locationInfo = this.buildLocationInfo();    

    return (
      <div className="app">
        <h1>Classy Weather</h1>

        {/* Input */}
        <UserInput city={this.state.city} onChange={this.handleInputText} />

        {/* Fetching data status */}
        {this.state.isLoading && <div>searching...</div>}

        {/* City result */}
        {this.state.weatherData?.country && <h2>{locationInfo}</h2>}
        {/* weatherInfo= Yogyakarta, Indonesia [flag] */}

        {/* Weather result */}
        {this.state.weatherData?.weather && (
          <Weather weather={this.state.weatherData?.weather} />
        )}
      </div>
    );
  }
}

class UserInput extends React.Component {
  render() {
    return (
      <input
        type="text"
        placeholder="Search for location"
        value={this.props.city}
        onChange={this.props.onChange}
      />
    );
  }
}

UserInput.propTypes = {
  city: PropTypes.string,
  onChange: PropTypes.func,
};

class Weather extends React.Component {
  render() {
    const { weather } = this.props;
    return (
      <ul className="weather">
        {weather &&
          weather.map((e, i) => {
            return (
              <Day
                key={e.day}
                day={e.day}
                icon={e.icon}
                temp_max={e.temp_max}
                temp_min={e.temp_min}
                isToday={i === 0}
              />
            );
          })}
      </ul>
    );
  }
}

Weather.propTypes = {
  weather: PropTypes.array.isRequired,
};

class Day extends React.Component {
  render() {
    const { day, icon, temp_max, temp_min, isToday } = this.props;
    return (
      <li key={day} className={`day ${isToday ? 'important' : ''}`}>
        <span>{icon}</span>

        <p>{day}</p>
        <p>{`${Math.floor(temp_min)}° - ${Math.ceil(temp_max)}°`}</p>
      </li>
    );
  }
}

Day.propTypes = {
  day: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  temp_max: PropTypes.number.isRequired,
  temp_min: PropTypes.number.isRequired,
  isToday: PropTypes.bool,
};

export default App;
