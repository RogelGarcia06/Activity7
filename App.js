import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Picker, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row } from 'react-native-table-component';
import { TouchableOpacity } from 'react-native-gesture-handler';

const STUDENT_DATA_KEY = 'studentData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF0000',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  button: {
    height: 50,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  tableHead: { height: 40, backgroundColor: '#4285f4', borderRadius: 5 },
  tableText: { margin: 6, textAlign: 'center', color: 'light-gray' },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  successMessage: {
    padding: 1,
    backgroundColor: 'black',
    marginTop: 1,
    borderRadius: 1,
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'Arial',
  },
  rowContainer: {
    flexDirection: 'column',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 10,
  },
});

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const storeStudentData = async (studentData) => {
    try {
      const existingData = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      const newData = existingData ? JSON.parse(existingData) : [];
      newData.push(studentData);
      await AsyncStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(newData));
      setData(newData);
      setModalVisible(false);

      setSuccessMessage('Data added successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error storing student data:', error);
    }
  };

  const getStudentData = async () => {
    try {
      const studentData = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      setData(studentData ? JSON.parse(studentData) : []);
    } catch (error) {
      console.error('Error getting student data:', error);
    }
  };

  const handleAddStudent = () => {
    if (firstName && lastName && course && username && password) {
      const studentData = {
        firstName,
        lastName,
        course,
        username,
        password,
      };
      storeStudentData(studentData);
      setFirstName('');
      setLastName('');
      setCourse('');
      setUsername('');
      setPassword('');
    } else {
      setSuccessMessage('Please fill in all fields');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleViewStudents = () => {
    getStudentData();
    setModalVisible(true);
  };

  const handleRowClick = (index) => {
    setSelectedStudent(data[index]);
    setDetailsModalVisible(true);
  };

  const renderStudentDetails = () => {
    if (selectedStudent) {
      return (
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <Text>Name: {selectedStudent.firstName} {selectedStudent.lastName}</Text>
          <Text>Course: {selectedStudent.course}</Text>
          <Text>Username: {selectedStudent.username}</Text>
          <Text>Password: {selectedStudent.password}</Text>
          <Button
            title="Close"
            onPress={() => setDetailsModalVisible(false)}
            style={[styles.button, { marginTop: 10 }]}
          />
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    getStudentData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Student Form</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Picker
        style={styles.picker}
        selectedValue={course}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Select Course" value="" />
        <Picker.Item label="BSIT" value="BSIT" />
        <Picker.Item label="BSMet" value="BSMet" />
        <Picker.Item label="BS-CRIM" value="BS-CRIM" />
        <Picker.Item label="BSN" value="BSN" />
        <Picker.Item label="BSHM" value="BSHM" />
        <Picker.Item label="BSCS" value="BSCS" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleAddStudent}>
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 10 }]}
        onPress={handleViewStudents}>
        <Text style={styles.buttonText}>View Student List</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9', borderRadius: 8 }}>
            <Row
              data={['No.', 'Full Name', 'Course', 'Username']}
              style={styles.tableHead}
              textStyle={styles.tableText}
            />
            {data.map((rowData, index) => (
              <View key={index} style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => handleRowClick(index)}>
                  <Row
                    data={[
                      index + 1,
                      `${rowData.firstName} ${rowData.lastName}`,
                      rowData.course,
                      rowData.username,
                    ]}
                    textStyle={styles.tableText}
                  />
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </Table>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}>
        {renderStudentDetails()}
      </Modal>
      {successMessage !== '' && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default App;