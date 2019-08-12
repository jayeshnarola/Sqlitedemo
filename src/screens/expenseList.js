import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Database from '../db/Database';

const db = new Database();
export default class ExpenseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            expenseList: [],
            isBlank: false,
            isFetching: false,
            searchExpenseList: []
        }
    }

    componentWillMount() {
        this.getExpenseList();
    }
    searchData(search) {
        this.setState({ search: search });
        const newData = this.state.searchExpenseList.filter(item => {
            const itemData = `${item.eName.toUpperCase()}${item.desc.toUpperCase()}`;
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ expenseList: newData });
    }
    Update(item) {
        this.props.navigation.navigate('addNewExpense', { getRefreshdata: () => this.getExpenseList(), isUpdateCalled: true, expense: item })
    }
    delete(item, index) {
        db.deleteExpense(item.eId).then((db, result) => {
            if (db.rowsAffected) {
                let arr = this.state.expenseList;
                arr.splice(index, 1)
                this.setState({ expenseList: arr });
                if(this.state.expenseList.length == 0){
                    this.setState({isBlank:true})
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    getExpenseList() {
        let expenses = [];
        db.listExpense().then((data) => {
            expenses = data;
            this.setState({ expenseList: expenses, searchExpenseList: expenses })
            this.setState({ isFetching: false })
            if (this.state.expenseList.length == 0) {
                this.setState({ isBlank: true });
            } else {
                this.setState({ isBlank: false });
            }

        }).catch((err) => {
            console.log(err);
        })
    }
    renderHeader() {
        return (
            <View style={{ height: 50, backgroundColor: '#41cac5' }}>
                <View style={{ flex: 0.1 }}></View>
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Expense List</Text>
                </View>
                <View style={{ flex: 0.1 }}></View>
            </View>
        )
    }
    onRefresh() {
        this.setState({ isFetching: true });
        this.getExpenseList();
    }
    renderItem = (item) => {
        console.log(item);
        
        return (
            <View style={{ marginBottom: 10, padding: 5, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.65, height: 25, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: '600' }}>{item.item.eName}</Text>
                    </View>
                    <View style={{ flex: 0.35, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.Update(item.item)} style={{ height: 20, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#ddd' }}>
                            <Text style={{ fontSize: 12 }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.delete(item.item, item.index)} style={{ height: 20, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: '#ddd' }}>
                            <Text style={{ fontSize: 12 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={{ marginLeft: 10, fontSize: 13, marginVertical: 5 }}>{item.item.desc}</Text>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                {
                    this.state.isBlank == false ?
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 40, width: '95%', alignSelf: 'center', borderRadius: 5, borderColor: '#ccc', borderWidth: 1, marginVertical: 10 }}>
                                <TextInput
                                    style={{ height: 40, paddingLeft: 10 }}
                                    placeholder="Search here!"
                                    autoFocus={false}
                                    autoCorrect={false}
                                    onChangeText={(text) => this.searchData(text)}
                                    value={this.state.search}
                                />
                            </View>
                            <FlatList
                                contentContainerStyle={{ width: '95%', alignSelf: 'center', paddingBottom: 25 }}
                                extraData={this.state}
                                data={this.state.expenseList}
                                onRefresh={() => this.onRefresh()}
                                refreshing={this.state.isFetching}
                                renderItem={this.renderItem}
                            />
                        </View>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20 }}>Data not Found</Text>
                        </View>
                }
                <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('addNewExpense', { getRefreshdata: () => this.getExpenseList() })
                    }} style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, alignSelf: 'flex-end', marginHorizontal: 10, marginVertical: 10, backgroundColor: '#41cac5' }}>
                        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
} 