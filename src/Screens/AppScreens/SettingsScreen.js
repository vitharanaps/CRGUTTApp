import React from 'react'
import {FlatList, Text, View} from 'react-native'
import LineFlatlist from '../../compo/LineFlatlist'
import SettingsHeader from '../../compo/SettingsHeader'
import SettingsMenu from '../../compo/SettingsMenu'
import { useTheme } from '../../theme/ThemeProvider'

const SettingsScreen = () => {
  const {colors} = useTheme();
  return (
    <View style={{ backgroundColor : colors.primary, flex:1}}>    
      <SettingsHeader />
      <Text style={{ fontSize:25,fontWeight:"600", letterSpacing:0, paddingHorizontal:10,paddingVertical:15,color:colors.text1 }}>
        Settings
      </Text>
     
      <SettingsMenu />
     
    </View>
  )
}

export default SettingsScreen