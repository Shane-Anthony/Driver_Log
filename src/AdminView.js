import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

// AdminView component containing weekly and daily views
const AdminView = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5A9367', // Active tab text color
        tabBarInactiveTintColor: 'gray', // Inactive tab text color
        tabBarIndicatorStyle: { backgroundColor: '#5A9367' }, // Active tab indicator color
        tabBarStyle: { backgroundColor: '#D9D9D9' }, // Tab bar background color
      }}
    >
      <Tab.Screen name="Weekly" component={WeeklyView} />
      <Tab.Screen name="Daily" component={DailyView} />
    </Tab.Navigator>
  );
};

// WeeklyView component for displaying weekly journeys
const WeeklyView = () => {
  const [journeys, setJourneys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedColumn, setExpandedColumn] = useState(null);
  const scrollRef = useRef(null);
  const window = useWindowDimensions();

  useEffect(() => {
    // Fetch weekly journeys when selectedDate changes
    fetchWeeklyJourneys();
  }, [selectedDate]);

  const fetchWeeklyJourneys = async () => {
    try {
      // Calculate start and end dates for the current week
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Format dates for API request
      const formattedStartDate = startOfWeek.toISOString().split('T')[0];
      const formattedEndDate = endOfWeek.toISOString().split('T')[0];

      // Fetch weekly journeys from the server
      const response = await axios.get(`http://localhost:3000/weeklyjourneys?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      if (response.status === 200) {
        setJourneys(response.data);
      } else {
        console.error('Failed to fetch journeys data');
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  const getStartOfWeek = (date) => {
    // Calculate the start of the week for a given date
    const day = date.getDay();
    const diff = (date.getDate() - day + (day === 0 ? -6 : 1)); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  // Handlers for navigating to previous and next weeks
  const goToPreviousWeek = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 7);
    setSelectedDate(previousDate);
  };

  const goToNextWeek = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 7);
    setSelectedDate(nextDate);
  };

  // Format date to display in the navigation bar
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  // Calculate start and end dates of the current week
  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const containerHeight = window.height - 250;

  const toggleExpandColumn = (column) => {
    setExpandedColumn(expandedColumn === column ? null : column);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <Text>{`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`}</Text>
        <TouchableOpacity onPress={goToNextWeek}>
          <Ionicons name="chevron-forward-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <DataTable>
  <DataTable.Header style={styles.tableHeader}>
    {['Date', 'Name', 'Start', 'Make', 'Reg', 'End'].map((title, index) => (
      <TouchableOpacity key={index} style={styles.cell} onPress={() => toggleExpandColumn(title)}>
        <DataTable.Title style={[expandedColumn === title ? styles.expandedCell : styles.cell, { fontSize: 10 }]}>
          {title}
        </DataTable.Title>
      </TouchableOpacity>
    ))}
  </DataTable.Header>
  <ScrollView
    ref={scrollRef}
    style={styles.scrollContainer}
    onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
    contentContainerStyle={{ height: containerHeight }}
    showsVerticalScrollIndicator={false}
  >
    {journeys.map((journey, index) => (
      <DataTable.Row style={styles.tableRow} key={index}>
        <DataTable.Cell style={expandedColumn === 'Date' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{formatDate(journey.DATE)}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={expandedColumn === 'Name' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.DRIVER_NAME}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={expandedColumn === 'Start' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.START_TIME}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={expandedColumn === 'Make' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.VEHICLE_MAKE}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={expandedColumn === 'Reg' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.VEHICLE_REG}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={expandedColumn === 'End' ? styles.expandedCell : styles.cell}>
          <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.END_TIME}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    ))}
  </ScrollView>
</DataTable>
    </View>
  );
};

const DailyView = () => {
  const [journeys, setJourneys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedColumn, setExpandedColumn] = useState(null);
  const scrollRef = useRef(null);
  const window = useWindowDimensions();


  useEffect(() => {

    fetchJourneys(); // Fetch journeys data when component mounts
  }, [selectedDate]); // Fetch journeys data when selectedDate changes

  const fetchJourneys = async () => {
    try {
      // Format selectedDate for API request
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Fetch daily journeys from the server
      const response = await axios.get(`http://localhost:3000/dailyjourneys?date=${formattedDate}`);
      if (response.status === 200) {
        setJourneys(response.data);
      } else {
        console.error('Failed to fetch journeys data');
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  // Handlers for navigating to previous and next days
  const goToPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  const containerHeight = window.height - 250;

  const toggleExpandColumn = (column) => {
    setExpandedColumn(expandedColumn === column ? null : column);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={goToPreviousDay}>
          <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
        </TouchableOpacity>
        <Text>{formatDate(selectedDate)}</Text>
        <TouchableOpacity onPress={goToNextDay}>
          <Ionicons name="chevron-forward-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <DataTable>
        <DataTable.Header style={styles.tableHeader}>
          {['Name', 'Start', 'Make', 'Reg', 'End'].map((title, index) => (
            <TouchableOpacity key={index} style={styles.cell} onPress={() => toggleExpandColumn(title)}>
              <DataTable.Title style={[expandedColumn === title ? styles.expandedCell : styles.cell, { fontSize: 10 }]}>
                {title}
              </DataTable.Title>
            </TouchableOpacity>
          ))}
        </DataTable.Header>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollContainer}
          onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
          contentContainerStyle={{ height: containerHeight }}
          showsVerticalScrollIndicator={false}
        >
          {journeys.map((journey, index) => (
            <DataTable.Row style={styles.tableRow} key={index}>
              <DataTable.Cell style={expandedColumn === 'Name' ? styles.expandedCell : styles.cell}>
                <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.DRIVER_NAME}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={expandedColumn === 'Start' ? styles.expandedCell : styles.cell}>
                <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.START_TIME}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={expandedColumn === 'Make' ? styles.expandedCell : styles.cell}>
                <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.VEHICLE_MAKE}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={expandedColumn === 'Reg' ? styles.expandedCell : styles.cell}>
                <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.VEHICLE_REG}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={expandedColumn === 'End' ? styles.expandedCell : styles.cell}>
                <Text style={{ fontSize: 11 , textAlign: 'center',}}>{journey.END_TIME}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 1,
  },
  expandedCell: {
    flex: 2, // Adjust this value to control the expanded size
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 1,
  },
});

export default AdminView;
