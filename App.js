import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const baseURL = "http://demo.subsonic.org/rest/"
const user = "guest"
const password = "guest"
const version = "1.12.0"
const client = "12345"

// http://demo.subsonic.org/rest/getAlbumList2?u=guest&p=guest&v=1.12.0&c=12345&type=newest

export default function App() {

  const getData = async (type) => {
    let album_ids = []
    const response = await axios.get(baseURL + "getAlbumList2?" + "u=" + user + "&p=" + password + "&v=" + version + "&c=" + client + "&type=" + type + "&f=json");
    
    if(response.data){
      const album_list = response.data["subsonic-response"]["albumList2"]["album"]
      for(let i = 0; i < 10; i++){
        album_ids.push(album_list[i]["id"])
      }
    }

    const album_details = [];

    for(let i = 0; i < album_ids.length; i++){
      const album_response = await axios.get(baseURL + "getAlbum?" + "u=" + user + "&p=" + password + "&v=" + version + "&c=" + client + "&id=" + album_ids[i] + "&f=json");
      album_details.push(album_response.data["subsonic-response"]["album"]);
    }
    console.log(album_details);
    
  }

  getData("newest");
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
