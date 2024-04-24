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
    // console.log(`interval ID: ${this.timeoutID}`);
  };

  searchCity = async (city) => {
    if (this.timeoutID != null) {
      this.clearTimeoutCity(this.timeoutID);      
    }

    /// If city is null, setItem will save 'null' (as string). 
    /// To prevent this call getItem and assign empty string if it's null,
    /// ex: getItem('city') || ''.

    localStorage.setItem('city', city); 

    // console.log('city', city);
    if (city) console.log('city is', city);
    if (!city || city.length < 2) return;


    this.timeoutID = this.setTimeoutCity(city);
  };

  buildLocationInfo = () => {
    let result = '';
    if (this.state.weatherData?.country) {
      result = this.state.city;
      if (this.state.weatherData.country) {
        result += ', ' + this.state.weatherData.country;
      }
      if (this.state.weatherData.flag) {
        result += ' ' + this.state.weatherData.flag;
      }
    }
    return result;
  };

  clearTimeoutCity(timeoutID) {
      console.log('this.timeoutID', this.timeoutID);
      console.log(`clear timeout ID: ${timeoutID}`);
      clearTimeout(timeoutID);
      this.timeoutID = null;
    
  }

  setTimeoutCity(city) {
    return setTimeout(async () => {
      this.setState((state) => ({
        ...state,
        isLoading: true,
      }));
      console.log('request weather data');
      try {
        var results = await getWeather(city);

        console.log('this.state.city', this.state.city);
        console.log('city', city);

        if (this.state.city === city) {
          this.setState((state) => ({
            ...state,
            weatherData: results,
          }));
        }
      } finally {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      }
    }, 1000);
  }

  /// componentDidMount is like useEffect with empty dependency array
  componentDidMount() {
    // console.log('');
    const city = localStorage.getItem('city') || '';
    console.log('localStorage getItem city', city);
    this.setState((state) => ({
      ...state,
      city: city,
      weatherData: {},
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.city !== prevState.city) {
      this.searchCity(this.state.city);
    }
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

  componentWillUnmount(){
    console.log('Weather component will unmount');
  }

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
