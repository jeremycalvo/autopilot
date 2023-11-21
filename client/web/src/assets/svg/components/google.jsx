import * as React from "react"
import Svg, { Path } from "react-native-svg"

const GoogleComponent = (props) => (
  <Svg
    width={42}
    height={42}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.114 24.316a10.964 10.964 0 0 1-.616-3.587c0-1.25.226-2.46.596-3.588l-.01-.24-5.785-4.402-.19.088a17.859 17.859 0 0 0-1.973 8.142c0 2.922.72 5.683 1.974 8.141l6.004-4.554"
      fill="#FBBC05"
    />
    <Path
      d="M39.41 21.131c0-1.49-.123-2.58-.39-3.708H21.643v6.731h10.2c-.206 1.673-1.316 4.192-3.784 5.885l-.034.225 5.494 4.171.38.038c3.496-3.164 5.512-7.82 5.512-13.341"
      fill="#4285F4"
    />
    <Path
      d="M21.642 38.866c4.997 0 9.192-1.612 12.256-4.393l-5.84-4.434c-1.563 1.068-3.66 1.814-6.416 1.814a11.12 11.12 0 0 1-10.529-7.537l-.217.018-5.713 4.333-.074.203c3.043 5.925 9.295 9.996 16.533 9.996Z"
      fill="#34A853"
    />
    <Path
      d="M21.642 9.604c3.476 0 5.82 1.471 7.157 2.7l5.223-4.997c-3.208-2.922-7.383-4.716-12.38-4.716-7.238 0-13.49 4.07-16.533 9.996l5.984 4.554c1.501-4.373 5.655-7.537 10.55-7.537"
      fill="#EB4335"
    />
  </Svg>
)

export default GoogleComponent