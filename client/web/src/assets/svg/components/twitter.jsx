import * as React from "react"
import Svg, { Path } from "react-native-svg"

const TwitterComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} {...props}>
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#2daae1",
        fillOpacity: 1,
      }}
      d="M40 20c0 11.047-8.953 20-20 20S0 31.047 0 20 8.953 0 20 0s20 8.953 20 20Zm0 0"
    />
    <Path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#fff",
        fillOpacity: 1,
      }}
      d="M32.824 12.043c-.945.422-1.957.703-3.023.832a5.279 5.279 0 0 0 2.316-2.914 10.514 10.514 0 0 1-3.344 1.277 5.253 5.253 0 0 0-3.84-1.66 5.261 5.261 0 0 0-5.124 6.461 14.924 14.924 0 0 1-10.844-5.496 5.266 5.266 0 0 0 1.625 7.023 5.264 5.264 0 0 1-2.383-.656v.067a5.263 5.263 0 0 0 4.223 5.156 5.255 5.255 0 0 1-1.387.183c-.34 0-.668-.03-.992-.09a5.27 5.27 0 0 0 4.914 3.653 10.564 10.564 0 0 1-7.79 2.18 14.897 14.897 0 0 0 8.067 2.363c9.676 0 14.969-8.016 14.969-14.969 0-.23-.004-.457-.016-.68a10.72 10.72 0 0 0 2.63-2.73Zm0 0"
    />
  </Svg>
)

export default TwitterComponent
