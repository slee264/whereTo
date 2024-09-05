import { Button, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const baseURL = "http://demo.subsonic.org/rest/"
const user = "guest"
const password = "guest"
const version = "1.12.0"
const client = "12345"

const baseOptions = {
  u: user,
  p: password,
  v: version,
  c: client
}

// http://demo.subsonic.org/rest/getAlbumList2?u=guest&p=guest&v=1.12.0&c=12345&type=newest

function ListCard(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const tracksRef = useRef([]);
  const albumInfoRef = useRef(null);
  const album = props.album;
  const id = album["id"]
  const artist = album["artist"]
  const name = album["name"]
  const songs = album["songs"]
  const requestURL = baseURL + "getCoverArt?" + new URLSearchParams({...baseOptions, id})
  
  const imageComponent = useCallback( 
    (<Image source={{uri: requestURL}}
      style={{width: 100, height: 100}} />)
  , [id])

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await axios.get(baseURL + "getAlbum", {
        params: {
          ...baseOptions,
          id,
          f: "json"
        }
      })
      if(response.data){
        tracksRef.current = response.data["subsonic-response"]["album"]["song"];
      }
    }
    fetchSongs();

  }, [props]);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {imageComponent}
          <View>
            <Text>{name}</Text>
            <Text>{artist}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
            <ScrollView>
            {imageComponent}
              <Text style={{ fontSize: 18, marginBottom: 10 }}>{name}</Text>
              <Text>{artist}</Text>
              <Text>Genre: {album["genre"]}</Text>
              <Text>Track List: </Text>
              {tracksRef.current.map((song) => {
                return (<Text key={song["id"]}>{song["title"]}</Text>)
              })}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>

    
  )

  
}

export default function App() {
  const albumIdsRef = useRef([]);

  useEffect(() => {
    getData("newest");
  })

  const getData = async (type) => {
    const response = await axios.get(baseURL + "getAlbumList2", {
      params: {
        ...baseOptions,
        type,
        f: "json"
      }
    })

    let albums = []

    if(response.data){
      const album_list = response.data["subsonic-response"]["albumList2"]["album"]
      for(let i = 0; i < 10; i++){
        albums.push(album_list[i])
      }
    }

    albumIdsRef.current = albums;
  }
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {albumIdsRef.current.map((album) => <ListCard key={album["id"]} album={album}></ListCard>)}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
});
