import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';



export default class App extends Component {

    constructor() {
        super()
      
        this.state = {
            resultText: '',
            calculationText: '',
            
            screen: Dimensions.get('window')
        }
        this.operations = ['DEL', '+', '-', '*', '/', 'cos(', 'sin(']

       

    }

    //
    getOrientation(){
        if (this.state.screen.width > this.state.screen.height) {
          return 'LANDSCAPE';
        }else {
          return 'PORTRAIT';
        }
      }
    
      getStyle(){
        if (this.getOrientation() === 'LANDSCAPE') {
          return landscapeStyles;
        } else {
          return portraitStyles;
        }
      }
      onLayout(){
        this.setState({screen: Dimensions.get('window')});
      }
    //

    buttonPressed(text) {

        if (text == '=') {
            return this.validate() && this.calculateResult(this.state.resultText)
        }
        this.setState({
            resultText: this.state.resultText + text
        })
    }

    validate() {
        const text = this.state.resultText
        switch (text.slice(-1)) {
            case '+':
            case '-':
            case '*':
            case '/':
                return false
        }
        return true
    }
    operate(operation) {
        switch (operation) {
            case 'DEL':
                let text = this.state.resultText.split('')
                text.pop()
                this.setState({
                    resultText: text.join('')
                })
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            
                const lastChar = this.state.resultText.split('').pop()

                if (this.operations.indexOf(lastChar) > 0) return

                if (this.state.text == '') return
                this.setState({
                    resultText: this.state.resultText + operation
                })
                case 'cos(':
                case 'sin(':
                        this.setState({
                            resultText: this.state.resultText + operation
                        })
            default:
                break;
        }
       
    }

    calculateResult() {
        let text = this.state.resultText;
        
        if(text.match(/cos\(\d+\)/)){
            let cosOp = text.match(/cos\(\d+\)/);
            let rad = text.substr(cosOp.index+4, cosOp[0].length - 5);
            text = text.replace(/cos\(\d+\)/, () => {
                return Math.cos(rad * Math.PI / 180) >= 0 ? `${Math.cos(rad * Math.PI / 180).toFixed(3)}` : `(${Math.cos(rad * Math.PI / 180).toFixed(3)})`
            });
        }
        if(text.match(/sin\(\d+\)/)){
            let sinOp = text.match(/sin\(\d+\)/);
            let rad = text.substr(sinOp.index+4, sinOp[0].length - 5);
            text = text.replace(/sin\(\d+\)/, () => {
                return Math.sin(rad * Math.PI / 180) >= 0 ? `${Math.sin(rad * Math.PI / 180).toFixed(3)}` : `(${Math.sin(rad * Math.PI / 180).toFixed(3)})`
            }); 
        }
        console.log(text);
        
        eval(text)
        //parse

        this.setState({
            calculationText: eval(text),
            resultText: ''
        })

    }

    render() { 
        let rows = []
        let nums = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['.', 0, '='], ['(', ')', '']]
        if(this.getOrientation() === 'PORTRAIT'){ 
            for (let i = 0; i < 4; i++) {
                let row = []
                for (let j = 0; j < 3; j++) {
                    row.push(
                        <TouchableOpacity key={nums[i][j]} onPress={() => this.buttonPressed(nums[i][j])} style={styles.btn}>
                            <Text style={[styles.btnText, styles.white]}>{nums[i][j]}</Text>
                        </TouchableOpacity>
                    )
                }
                rows.push(<View style={styles.row}>
                    {row}
                </View>)
            }
        }else{
            for (let i = 0; i < 5; i++) {
                let row = []
                for (let j = 0; j < 3; j++) {
                    row.push(
                        <TouchableOpacity key={nums[i][j]} onPress={() => this.buttonPressed(nums[i][j])} style={styles.btn}>
                            <Text style={[styles.btnText, styles.white]}>{nums[i][j]}</Text>
                        </TouchableOpacity>
                    )
                }
                rows.push(<View style={styles.row}>
                    {row}
                </View>)
            }
        }


        let ops = []
        if(this.getOrientation() === 'PORTRAIT'){ 
            for (let i = 0; i < 5; i++) {
                ops.push(
                    <TouchableOpacity key={ops[i]} style={styles.btn} onPress={() => this.operate(this.operations[i])}>
                        <Text style={[styles.btnText, styles.white]}>
                            {this.operations[i]}
                        </Text>
                    </TouchableOpacity>
                )
            }
        }else{
            for (let i = 0; i < 7; i++) {
                ops.push(
                    <TouchableOpacity key={ops[i]} style={this.getStyle().btn} onPress={() => this.operate(this.operations[i])}>
                        <Text style={[this.getStyle().btnText, styles.white]}>
                            {this.operations[i]}
                        </Text>
                    </TouchableOpacity>
                )
            }
        }
       
            return (
                <View style={this.getStyle().container} onLayout = {this.onLayout.bind(this)} >
                    <View style={this.getStyle().result}>
                        <Text style={this.getStyle().resultText}>
                            {this.state.resultText}
                        </Text>
                    </View>
                    <View style={this.getStyle().calculation}>
                        <Text style={this.getStyle().calculationText}>
                            {this.state.calculationText}
                        </Text>
                    </View>
                    <View style={this.getStyle().buttons}>
                        <View style={this.getStyle().numbers}>
                            {rows}
                        </View>
                        <View style={this.getStyle().operations}>
                            {ops}
                        </View>
                    </View>
                </View>
            );
        
            
        
        
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,

    },
    resultText: {
        fontSize: 40,
        color: "black",
        
    },
    btn: {
        flex: 1,
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "center"
    },
    btnText: {
        fontSize: 30,
    },
    white: {
        color: "white"
    },
    calculationText: {
        fontSize: 30,
        color: 'rgba(0, 0, 0, 1.0)',
        
    },
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center"
    },
    result: {
        flex: 2,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "flex-end"
    },
    calculation: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: "center",
        alignItems: "flex-end",
        opacity: 0.3
    },
    buttons: {
        flex: 7,
        flexDirection: 'row'
    },
    numbers: {
        flex: 3,
        backgroundColor: '#434343',
        
    },
    operations: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: '#636363'
    }


});

const portraitStyles  = StyleSheet.create({

    container: {
        flex: 1,

    },
    resultText: {
        fontSize: 40,
        color: "black",
        
    },
    btn: {
        flex: 1,
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "center"
    },
    btnText: {
        fontSize: 30,
    },
    white: {
        color: "white"
    },
    calculationText: {
        fontSize: 30,
        color: 'rgba(0, 0, 0, 1.0)',
        
    },
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center"
    },
    result: {
        flex: 2,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "flex-end"
    },
    calculation: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: "center",
        alignItems: "flex-end",
        opacity: 0.3
    },
    buttons: {
        flex: 7,
        flexDirection: 'row'
    },
    numbers: {
        flex: 3,
        backgroundColor: '#434343',
        
    },
    operations: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: '#636363'
    }


});
const landscapeStyles  = StyleSheet.create({

    container: {
        flex: 1,

    },
    resultText: {
        fontSize: 40,
        color: "red",
        
    },
    btn: {
        flex: 1,
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "center"
    },
    btnText: {
        fontSize: 30,
    },
    white: {
        color: "white"
    },
    calculationText: {
        fontSize: 30,
        color: 'rgba(0, 0, 0, 1.0)',
        
    },
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center"
    },
    result: {
        flex: 2,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "flex-end"
    },
    calculation: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: "center",
        alignItems: "flex-end",
        opacity: 0.3
    },
    buttons: {
        flex: 7,
        flexDirection: 'row'
    },
    numbers: {
        flex: 3,
        backgroundColor: '#434343',
        
    },
    operations: {
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: '#636363'
    }


});