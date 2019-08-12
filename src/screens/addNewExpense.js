import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Picker } from 'react-native';
import Database from '../db/Database';
var FloatingLabel = require('react-native-floating-labels');

const db = new Database();
export default class AddNewExpense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isUpdateCall: false,
            category:'',
            expenseName:'',
            desc:'',
            eId:'',
            categoryList:[]
        }
    }
    componentWillMount(){
        this.getCategoryList();
        if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.expense) {
            this.setState({ expenseName: this.props.navigation.state.params.expense.eName, desc: this.props.navigation.state.params.expense.desc, eId: this.props.navigation.state.params.expense.eId, category: this.props.navigation.state.params.expense.cId,isUpdateCall: this.props.navigation.state.params.isUpdateCalled });
        }
    }
    getCategoryList() {
        let categories = [];
        db.listCategories().then((data) => {
            categories = data;
            this.setState({ categoryList: categories });
            // console.log(this.state.categoryList);
            
        }).catch((err) => {
            console.log(err);
        })
    }
    addExpense(){
        if (this.state.category != '' && this.state.category != undefined && this.state.category != null) {
            if(this.state.expenseName != '' && this.state.expenseName != undefined && this.state.expenseName != null){
            let data = {
                eId : this.state.eId,
                cId : this.state.category,
                eName: this.state.expenseName,
                desc: this.state.desc,
            }
            if (this.state.isUpdateCall == false) {
                db.addExpense(data).then((db, result) => {
                    console.log(db);
                    
                    if (db.insertId) {
                        this.props.navigation.state.params.getRefreshdata();
                        this.props.navigation.pop();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }else{
                console.log("called");
                
                db.updateExpense(data).then((db, result) => {
                    if (db.rowsAffected) {
                        this.props.navigation.state.params.getRefreshdata();
                        this.props.navigation.pop();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        }else{
            alert('Please Enter Expense name');
        }
        } else {
            alert('Please Select Category');
        }
    }
    renderHeader() {
        return (
            <View style={{ height: 50, backgroundColor: '#41cac5', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { this.props.navigation.pop() }} style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ height: 20, width: 20, tintColor: 'white' }} source={require('../../src/images/back.png')} />
                </TouchableOpacity>
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        this.state.isUpdateCall == true ?
                            <Text style={{ fontSize: 20, color: 'white' }}>Update Expense</Text>
                            :
                            <Text style={{ fontSize: 20, color: 'white' }}>Add New Expense</Text>
                    }
                </View>
                <View style={{ flex: 0.1 }}></View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                <View>
                    <Picker
                        selectedValue={this.state.category}
                        style={{ width: '100%',Height:10}}
                        onValueChange={(itemValue, itemIndex) => {
                            console.log("itemValue",itemValue);
                             this.setState({ category: itemValue })
                        }
                        }>
                            <Picker.Item label="Select Category" value="" />
                            {
                                this.state.categoryList.map((item)=>{
                                   return(
                                    <Picker.Item label={item.cName} value={item.cId}  />
                                   ) 
                                })
                            }
                        {/* <Picker.Item label="C 2" value="C 2" /> */}
                    </Picker>
                </View>
                    <View style={{paddingTop:5, width: '95%', alignSelf: 'center' }}>
                        <FloatingLabel
                            labelStyle={{ color: 'gray', fontSize: 15 }}
                            inputStyle={{ borderWidth: 0 }}
                            style={{ borderBottomWidth: 1.5, borderColor: '#ccc' }}
                            value={this.state.expenseName}
                            onChangeText={(text) => this.setState({ expenseName: text })}
                        // onBlur={this.onBlur} 
                        >Expense Name</FloatingLabel>
                    </View>
                    <View style={{ paddingTop: 5, width: '95%', alignSelf: 'center' }}>
                        <FloatingLabel
                            labelStyle={{ color: 'gray', fontSize: 15 }}
                            inputStyle={{ borderWidth: 0 }}
                            style={{ borderBottomWidth: 1.5, borderColor: '#ccc' }}
                            value={this.state.desc}
                            multiline={true}
                            onChangeText={(text) => this.setState({ desc: text })}
                        // onBlur={this.onBlur} 
                        >Description</FloatingLabel>
                    </View>
                    <TouchableOpacity onPress={() => this.addExpense()} style={{ height: 45, width: 100, marginHorizontal: 10, marginVertical: 15, backgroundColor: 'white', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderColor: '#41cac5', borderWidth: 1, borderRadius: 15 }}>
                        {
                            this.state.isUpdateCall == true ?
                                <Text style={{ color: '#41cac5' }}>Update</Text>
                                :
                                <Text style={{ color: '#41cac5' }}>Add</Text>
                        }
                    </TouchableOpacity>
            </View>
        )
    }
}