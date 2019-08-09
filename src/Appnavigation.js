import { createStackNavigator, createAppContainer } from "react-navigation";
import categoryList from "./screens/categoryList";


const AppNavigator = createStackNavigator({
    categoryList: {
      screen: categoryList,
      navigationOptions:{
          header:null
      }
    }
  },
  {
      initialRouteName:'categoryList'
  }
  );

  export default createAppContainer(AppNavigator);