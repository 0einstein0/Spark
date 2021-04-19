import React, { useState } from 'react';
import { StyleSheet, Text, View, Image,Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import * as Google from 'expo-google-app-auth'; 
import firebase from 'firebase'; 
import Firebase from '../config/Firebase'; 
import * as Facebook from 'expo-facebook';

console.disableYellowBox = true;

  
export default function LoginScreen() {

  const [name, setName] = useState(false);
  const [isFBLoggedin, setFBLoggedinStatus] = useState(false);
  const [isGLoggedin, setGLoggedinStatus] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  const signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: 'YOUR_ANDROID_CLIENT_ID',
                
                scopes: ['profile', 'email'],
                permissions: ['public_profile', 'email', 'gender', 'location']
            })
            if (result.type === 'success') {
                 const googleUser = result.user
                setGLoggedinStatus(true)
                setPhotoUrl(googleUser.photoUrl)
                setName(googleUser.name)
                setEmail(googleUser.email)
                this.setState({
                    email: googleUser.email,
                    name: googleUser.name,
                })
                this.navigateToLoadingScreen() 
                return result.accessToken
            } else {
                return { cancelled: true }
            }
        } catch (e) {
            return { error: true }
        }
    }
  const facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync('YOUR_FB_APP_ID');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile','email', 'user_friends'],
      });
      if (type === 'success') {
       
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,birthday,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            setFBLoggedinStatus(true);
            setUserData(data);
           
            console.log(data);           
          })
          .catch(e => console.log(e))
      } else {
        
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  const logout = () => {
    setFBLoggedinStatus(false);
    setGLoggedinStatus(false);
    setUserData(null);
    setImageLoadStatus(false);
  }

  return (
    isFBLoggedin ?
      userData ?
        <View style={styles.container}>
        <Text style={{ fontSize: 20, marginVertical: 10 }}>Signed In Through</Text><Text style={{ fontSize: 22, fontWeight:"bold" ,color:"#4267b2", marginBottom: 30 }}>Facebook</Text>
          <Image
            style={{ width: 200, height: 200, borderRadius: 100 }}
            source={{ uri: userData.picture.data.url }}
            onLoadEnd={() => setImageLoadStatus(true)} />
          <ActivityIndicator size="large" color="#3B97DB" animating={!isImageLoading} style={{ position: "absolute" }} />
          <Text style={{ fontSize: 22, marginVertical: 10 }}>Hi {userData.name}!</Text>
           <Text style={{ fontSize: 18, marginVertical: 10 }}>{userData.email}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={()=> logout()}>
            <Text style={{ color: "#fff" }}>Logout</Text>
          </TouchableOpacity>
        </View> :
        null
      :
      isGLoggedin ? (
           <View style={styles.container}>
                <Text style={{ fontSize: 20, marginVertical: 10 }}>Signed In Through</Text><Text style={{ fontSize: 22, fontWeight:"bold" ,color:"#da4821", marginBottom: 30 }}>Google</Text>
          <Image
            style={{ width: 200, height: 200, borderRadius: 100 }}
            source={{ uri: photoUrl }}
            onLoadEnd={() => setImageLoadStatus(true)} />
          <ActivityIndicator size="large" color="#0000ff" animating={!isImageLoading} style={{ position: "absolute" }} />
          <Text style={{ fontSize: 22, marginVertical: 10 }}>Hi {name}!</Text>
           <Text style={{ fontSize: 18, marginVertical: 10 }}>{email}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={()=> logout()}>
            <Text style={{ color: "#fff" }}>Logout</Text>
          </TouchableOpacity>
        </View>
        ) : 
      
      <Screen style={styles.container}> 
       <Image style={styles.logo} source={require("../assets/logo-blue.png")} />
      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => console.log(values)}
       
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Sign In"/>
        <TouchableOpacity style={styles.fbBtn} onPress={() => facebookLogIn()}><Text style={{ color: "#fff", fontSize:18,  }}>Sign In with Facebook</Text>
        </TouchableOpacity>
<TouchableOpacity style={styles.ggBtn} onPress={() => signInWithGoogleAsync()}><Text style={{ color: "#fff", fontSize:18 }}>Sign In with Google</Text>
        </TouchableOpacity>
      </AppForm>
     
      </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    padding:10,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    justifyContent: 'center',
  },
    logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: -15,
    marginRight:15,
    marginBottom: 20,
  },
  fbBtn: {
    backgroundColor: '#4267b2',
    width:"100%",
    alignItems: "center",
    marginBottom: 10,
    elevation:5,
    paddingVertical: 13, 
    borderRadius: 75/2,
    marginTop:5

  },
   ggBtn: {
    backgroundColor: '#da4821',
    width:"100%",
    alignItems: "center",
    paddingVertical: 13,
    elevation:5,
    borderRadius: 75/2,
    marginTop:5

  },

  logoutBtn: {
    backgroundColor: '#de6262',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation:5,
    position: "absolute",
    bottom: 20
  },
});
