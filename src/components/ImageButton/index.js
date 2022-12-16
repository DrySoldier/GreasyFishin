import React, { memo } from "react";
import { ImageBackground, TouchableOpacity, Image } from "react-native";

const ImageButton = ({
  source,
  style,
  onPress,
  children,
  resizeMode = "contain",
  imageStyle = {},
  ...props
}) => {
  return (
    <TouchableOpacity {...props} onPress={onPress}>
      {children ? (
        <ImageBackground
          source={source}
          style={style}
          resizeMode={resizeMode}
          imageStyle={[imageStyle]}
        >
          {children}
        </ImageBackground>
      ) : (
        <Image source={source} style={style} resizeMode={resizeMode} />
      )}
    </TouchableOpacity>
  );
};

export default memo(ImageButton);
