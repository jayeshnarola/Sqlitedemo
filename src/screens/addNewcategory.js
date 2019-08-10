import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
var FloatingLabel = require('react-native-floating-labels');
// var SQLite = require('react-native-sqlite-storage')
import Database from '../db/Database';

const db = new Database();
export default class AddNewCateogry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cname: '',
            desc: '',
            cId: '',
            isUpdateCall: false
        }
    }
    componentWillMount() {
        console.log(this.props);
        if (this.props && this.props.navigation && this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.category) {
            this.setState({ cname: this.props.navigation.state.params.category.cName, desc: this.props.navigation.state.params.category.desc, cId: this.props.navigation.state.params.category.cId, isUpdateCall: this.props.navigation.state.params.isUpdateCalled })
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
                            <Text style={{ fontSize: 20, color: 'white' }}>Update Category</Text>
                            :
                            <Text style={{ fontSize: 20, color: 'white' }}>Add New Category</Text>
                    }
                </View>
                <View style={{ flex: 0.1 }}></View>
            </View>
        )
    }
    addCategory() {
        if (this.state.cname != '' && this.state.cname != undefined && this.state.cname != null) {
            let data = {
                cId : this.state.cId,
                c_name: this.state.cname,
                desc: this.state.desc,
            }
            if (this.state.isUpdateCall == false) {
                db.addCategory(data).then((db, result) => {
                    if (db.insertId) {
                        this.props.navigation.state.params.getRefreshdata();
                        this.props.navigation.pop();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }else{
                db.updateCategory(data).then((db, result) => {
                    if (db.rowsAffected) {
                        this.props.navigation.state.params.getRefreshdata();
                        this.props.navigation.pop();
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            // var db = SQLite.openDatabase({ name: "expense.db", createFromLocation: 1 });
            // if(this.state.isUpdateCall == false){
            //     db.executeSql("INSERT INTO categories (c_name, desc) VALUES (?,?)", [this.state.cname, this.state.desc], (db, res) =>{

            //         if (db.insertId) {
            //             this.props.navigation.state.params.getRefreshdata();
            //             this.props.navigation.pop();
            //         }
            //     },  (e) =>{
            //         console.log("ERROR: " + e.message);
            //     });
            // }else{
            //     db.executeSql('UPDATE categories SET c_name = ?, desc = ? WHERE c_id = ? ', [ this.state.cname, this.state.desc, this.state.cId ], (db,results)=>{
            //         if (db.rowsAffected) {
            //             this.props.navigation.state.params.getRefreshdata();
            //             this.props.navigation.pop();
            //         }
            //     }, (e) =>{
            //         console.log("ERROR: " + e.message);
            //     });
            // }
        } else {
            alert('Please Enter Category name');
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                <View style={{ flex: 1 }}>
                    <View style={{ paddingTop: 5, width: '95%', alignSelf: 'center' }}>
                        <FloatingLabel
                            labelStyle={{ color: 'gray', fontSize: 15 }}
                            inputStyle={{ borderWidth: 0 }}
                            style={{ borderBottomWidth: 1.5, borderColor: '#ccc' }}
                            value={this.state.cname}
                            onChangeText={(text) => this.setState({ cname: text })}
                        // onBlur={this.onBlur} 
                        >Category Name</FloatingLabel>
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
                    <TouchableOpacity onPress={() => this.addCategory()} style={{ height: 45, width: 100, marginHorizontal: 10, marginVertical: 15, backgroundColor: 'white', alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderColor: '#41cac5', borderWidth: 1, borderRadius: 15 }}>
                        {
                            this.state.isUpdateCall == true ?
                                <Text style={{ color: '#41cac5' }}>Update</Text>
                                :
                                <Text style={{ color: '#41cac5' }}>Add</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}