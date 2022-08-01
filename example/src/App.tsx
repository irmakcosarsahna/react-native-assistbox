import * as React from 'react';

import {StyleSheet,Button, View, Text} from 'react-native';
import {initVideoCallWithToken} from 'react-native-assistbox';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  const isCall = false
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNTIxZmFlOC1kNzY2LTQyZWUtYmM3Yy01MDRjMmM3ZWUxN2IiLCJ2YWxpZEZvckluU2Vjb25kcyI6NTE4NDAwMCwiZXhwIjoxNjY0NTQxNDQ5LCJpYXQiOjE2NTkzNTc0NDl9.KX5AhCcl2ozCfgiT9AzV6bjXgc1Umol7-yW88HaCX430KyIJ1IeV6sHwbYAZ2RYzyNs9mk7R91aVzHQ-gWXQAtWyRrViNQ5h4nWndJdH8IMAw71z5E-6h_bN8CRsqrvWntbQGKqV8UADdcMvLB-SDu8ddIRtE0hDoMoso0e7guFbRisuj_6QTxbCSdQa_rLvwtAO7SmmgO9NZlC9azQ7_JVDw6wKAyn5BbxdPWYxpnIqK4En8xqTbxSieM0ETyWwLsFW-qkqeXOPHy79xfCTxIsaluq_z5am2EQiwoZA1JkOtVAxz5f_HL0Qgm240yNkEfZHlFt4CO_hzAulrSb8NQ'
  const accessKey = 'ByxHQiiJ'

  const openAssist = () => {
    initVideoCallWithToken({
      token,
      mobileServiceEndpoint: 'https://go.assistbox.io',
      undefined
    }, (suc) => {
      console.log('suc', suc)
    }, (err) => {
      console.log('suc', err)
    })
  }


  return (
    <View style={styles.container}>
      <Button onPress={openAssist} title={'Open assistBox'}/>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
