import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import WebSocket from 'react-native-websocket';

const AutonomousCarApp = () => {
  const [speed, setSpeed] = useState(0);
  const [charge, setCharge] = useState(100);
  const [isConnected, setIsConnected] = useState(false);
  const [pastData, setPastData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connecting, setConnecting] = useState(false); 

  useEffect(() => {
    connectToWebSocket();

    
    return () => {
      if (socket && socket.close) {
        socket.close();
        console.log('WebSocket closed');
      }
    };
  }, []);

  const connectToWebSocket = async () => {
    try {
      const newSocket = new WebSocket('ws://localhost:8080'); // dont forget
      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnecting(false); 
      };
      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSpeed(data.speed);
        setCharge(data.charge);
        savePastData(data); 
      };
      setSocket(newSocket); 
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnecting(false); 
    }
  };

  const savePastData = async (data) => {
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    setPastData(prevData => [...prevData, { ...data, date: formattedDate }]);
  };

  const openModal = (data) => {
    setSelectedData(data);
    setModalVisible(true);
  };

  const renderPastDataItem = ({ item }) => (
    <TouchableOpacity style={styles.pastDataItem} onPress={() => openModal(item)}>
      <Text style={styles.pastDataItemText}>Speed: {item.speed}, Charge: {item.charge}%, Date: {item.date}</Text>
    </TouchableOpacity>
  );

  const connectToCar = () => {
    if (!isConnected) {
      setConnecting(true); 
      connectToWebSocket();
    } else {
      if (socket && socket.close) {
        socket.close();
        setIsConnected(false);
        console.log('Disconnected from WebSocket');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.connectionStatus}>{isConnected ? 'Connected' : 'Disconnected'}!</Text>
      <TouchableOpacity style={styles.button} onPress={connectToCar}>
        <Text style={styles.buttonText}>{isConnected ? 'Disconnect' : 'Connect to Car'}</Text>
      </TouchableOpacity>
      {connecting && <ActivityIndicator size="large" color="#9DB2BF" />} 
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Car Information</Text>
        <Text style={styles.info}>Speed: {speed}</Text>
        <Text style={styles.info}>Battery Charge: {charge}%</Text>
      </View>
      <View style={styles.pastDataContainer}>
        <Text style={styles.infoTitle}>Past Data</Text>
        <FlatList
          data={pastData}
          renderItem={renderPastDataItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false); 
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Speed: {selectedData?.speed}</Text>
              <Text style={styles.modalText}>Battery Charge: {selectedData?.charge}%</Text>
              <Text style={styles.modalText}>Date: {selectedData?.date}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)} 
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    width: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  connectionStatus: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    paddingBottom: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    margin: 10,
  },
  info: {
    fontSize: 16,
    color: '#fff',
  },
  pastDataContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  pastDataItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pastDataItemText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AutonomousCarApp;

