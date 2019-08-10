import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import categoryList from "./screens/categoryList";
import AddNewCateogry from "./screens/addNewcategory";
import React from "react";
import { Image } from "react-native";
const TabNavigation = createBottomTabNavigator({
    CategoryList: {
        screen: createStackNavigator({
            categoryList: {
                screen: categoryList,
                navigationOptions: {
                    header: null
                }
            },
            addNewCategory: {
                screen: AddNewCateogry,
                navigationOptions: {
                    header: null
                }
            }
        }, {
                initialRouteName: 'categoryList'
            }
        ),
        navigationOptions: ({ navigation, screenProps }) => ({
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={require('../src/images/shopping-list.png')}
                    resizeMode={'contain'}
                    style={{ tintColor, height: 34, width: 40 }}
                />
            ),
            tabBarOnPress: async (scene, jumpToIndex) => {
                if (navigation.isFocused()) {
                    navigation.navigate("CategoryList", { scrollTop: true });
                } else {
                    navigation.navigate("CategoryList");
                }
            }
        })
    },
    Expense: {
        screen: createStackNavigator({
            categoryList: {
                screen: categoryList,
                navigationOptions: {
                    header: null
                }
            },
            addNewCategory: {
                screen: AddNewCateogry,
                navigationOptions: {
                    header: null
                }
            }
        },{
            initialRouteName:'categoryList'
        }
        ),
        navigationOptions: ({ navigation, screenProps }) => ({
            tabBarIcon: ({ tintColor }) => (
                <Image
                    source={require('../src/images/cost.png')}
                    style={{ tintColor, height: 35, width: 40 }}
                    resizeMode={'contain'}
                />
            ),
            tabBarOnPress: async (scene, jumpToIndex) => {
                if (navigation.isFocused()) {
                    navigation.navigate("Expense", { scrollTop: true });
                } else {
                    navigation.navigate("Expense");
                }
            }
        })
    }
},
{
    tabBarPosition: "bottom",
    swipeEnabled: false,
    // gesturesEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      tabStyle: { marginTop: Platform.OS === "ios" ? 0 : 0,  },
      style: {  height: 60 },
      activeTintColor:'#41cac5',
      inactiveTintColor: '#777777',
      tabStyle:{borderColor:'#eee', borderWidth:1,},
    //   indicatorStyle: { backgroundColor: 'pink',borderRightColor:'red',borderRightWidth:1 }
    },
    initialRouteName: "Expense"
  })

const AppNavigator = createStackNavigator({
    categoryList: {
        screen: TabNavigation,
        navigationOptions: {
            header: null
        }
    },
    // addNewCategory: {
    //     screen: AddNewCateogry,
    //     navigationOptions:{
    //         header:null
    //     }
    //   }
},
    {
        initialRouteName: 'categoryList'
    }
);

export default createAppContainer(TabNavigation);