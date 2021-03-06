import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

class EditEmployeeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            email: "",
            loading: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        // state value is updated by selected employee data
        const { name,username, email } = this.props.selectedEmployee;
        this.setState({
            name: name,
            username: username,
            email: email
        })
    }

    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    updateEmployee = () => {
        // destructure state
        const { name, username, email } = this.state;
        this.setState({ errorMessage: "", loading: true });

        if (name && username && email) {
            // selected employee is updated with employee id
            fetch(`https://jsonplaceholder.typicode.com/users/${this.props.selectedEmployee.id}` , {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    id: this.props.selectedEmployee.id,
                    name: this.state.name,
                    username: this.state.username,
                    email: this.state.email
                })
            })
                .then(res => res.json())
                .then((json) => console.log(json))
                .then(res => {
                    this.props.closeModal();
                    this.props.updateEmployee({
                        name: res.name,
                        username: res.username,
                        email: res.email,
                        id: this.props.selectedEmployee.id
                    });
                })
                .catch(() => {
                    this.setState({ errorMessage: "Network Error. Please try again.", loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { name, username, email, loading, errorMessage } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Update User Info</Text>

                    <TextInput
                        value={name}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "name")}
                        placeholder="Full Name" />

                    <TextInput
                        defaultValue={username}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "username")}
                        placeholder="User Name" />
                    <TextInput
                        defaultValue={email}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "email")}
                        placeholder="Email" />

                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.updateEmployee}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        );
    }
}



export default EditEmployeeModal;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    }
})