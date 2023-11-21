import * as React from "react"
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg"

const FacebookComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} {...props}>
    <Defs>
      <LinearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1={16}
        y1={2}
        x2={16}
        y2={29.917}
        gradientTransform="scale(1.25)"
      >
        <Stop
          offset={0}
          style={{
            stopColor: "#18acfe",
            stopOpacity: 1,
          }}
        />
        <Stop
          offset={1}
          style={{
            stopColor: "#0163e0",
            stopOpacity: 1,
          }}
        />
      </LinearGradient>
    </Defs>
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "url(#a)",
      }}
      d="M37.5 20c0 9.664-7.836 17.5-17.5 17.5S2.5 29.664 2.5 20 10.336 2.5 20 2.5 37.5 10.336 37.5 20Zm0 0"
    />
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#fff",
        fillOpacity: 1,
      }}
      d="m26.516 25.352.777-4.938H22.43v-3.207c0-1.352.68-2.668 2.86-2.668h2.21v-4.207S25.492 10 23.574 10c-4.004 0-6.62 2.367-6.62 6.648v3.766H12.5v4.938h4.453v11.941a18.112 18.112 0 0 0 5.477 0V25.352Zm0 0"
    />
  </Svg>
)

export default FacebookComponent
