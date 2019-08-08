

import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import { scaleLinear } from "d3-scale"
import { geoTimes } from "d3-geo-projection"
import { geoPath } from "d3-geo"
const city = [
  { "name": "Mumbai", "coordinates": [72.8777,19.0760], "population": 17712000 },
  { "name": "Delhi", "coordinates": [77.1025,28.7041], "population": 24998000 },
  { "name": "Tokyo", "coordinates": [139.6917,35.6895], "population": 37843000 },
  { "name": "Jakarta", "coordinates": [106.8650,-6.1751], "population": 30539000 },
  { "name": "Manila", "coordinates": [120.9842,14.5995], "population": 24123000 },
  { "name": "Seoul", "coordinates": [126.9780,37.5665], "population": 23480000 },
  { "name": "Shanghai", "coordinates": [121.4737,31.2304], "population": 23416000 },
  { "name": "Karachi", "coordinates": [67.0099,24.8615], "population": 22123000 },
  { "name": "Beijing", "coordinates": [116.4074,39.9042], "population": 21009000 },
  { "name": "New York", "coordinates": [-74.0059,40.7128], "population": 20630000 },
  { "name": "Guangzhou", "coordinates": [113.2644,23.1291], "population": 20597000 },
  { "name": "Sao Paulo", "coordinates": [-46.6333,-23.5505], "population": 20365000 },
  { "name": "Mexico City", "coordinates": [-99.1332,19.4326], "population": 20063000 },
]
const cityScale = scaleLinear()
  .domain([0,37843000])
  .range([1,25])

const popScale = scaleLinear()
  .domain([0,100000000,1400000000])
  .range(["#CFD8DC","#607D8B","#37474F"])

class BasicMap extends Component {
  static defaultProps = {
    width: 800,
    height: 450,
  }
  constructor() {
    super()
    this.state = {
      center: [0,0],
      zoom: 1,
      currentCountry: null,  
      markup:false
    }
    this.projection = this.projection.bind(this)
    this.handleGeographyClick = this.handleGeographyClick.bind(this)
  }
  projection() {
    return geoTimes()
      .translate([this.props.width/2, this.props.height/2])
      .scale(160)
  }
  handleGeographyClick(geography) {
    if (this.state.currentCountry === geography.properties.iso_a3) {
      return this.setState({
        center: [0,0],
        zoom: 1,
        currentCountry: null,
        markup : !this.state.markup
      });
    }

    const path = geoPath().projection(this.projection());
    const center = this.projection().invert(path.centroid(geography));

    //calculate zoom level
    const bounds = path.bounds(geography);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const zoom = 0.9 / Math.max(dx / this.props.width, dy / this.props.height);

    this.setState({ 
      center, 
      zoom , 
      currentCountry: geography.properties.iso_a3, 
      markup : !this.state.markup
    });
  }
  componentDidMount() {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 100)
    
  }
  render() {
    return (
      <div style={resp}>

        <ComposableMap
          
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
         
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
            <Geographies geography={"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/examples/choropleth-map/static/world-50m-with-population.json"}>
              {(geographies, projection) => 
              geographies.map((geography, i) => geography.id !== "010" && (
                <Geography
                  key={ i }
                  data-tip={geography.properties.labelrank+'.'+  geography.properties.name}
                  data-for= "id"
                  geography={ geography }
                  projection={ projection }
                  style={{
                    default: {
                      fill: popScale(geography.properties.pop_est),
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#263238",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                  onClick={this.handleGeographyClick} 
                /> 
              ))} 
            </Geographies>
            {
            this.state.markup ? 
            <Markers>
                  {
                    city.map((city, i) => (
                    <Marker
                      key={i}
                      marker={city}
                      data-tip={city["name"] + ": " + "Population" + " " + city["population"]}
                      data-for="test"
                      >
                      <circle 
                      cx={0}
                      cy={0}
                      r={cityScale(city.population)}
                      fill="rgba(77, 184, 255,0.8)"
                      />
                      <ReactTooltip id="test" />
                    </Marker>
                  ))}
                </Markers> : null
            }
          </ZoomableGroup>
        </ComposableMap>
        
        <ReactTooltip id="id"/> 
      </div>
    )
  }
}

export default BasicMap
