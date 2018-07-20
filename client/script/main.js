var ac;
const Settings = {
  net:
  {
    serverAddress: "127.0.0.1",
    serverPort: 2972
  },
  security:
  {
    serverPublic: "-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHysQMrQxJKaGTdD/Q8tFQxqDiKR\nL+7Qd0ntUf9Rxk3bkqFq8rvQlnC60diCVDjuT/H3dsRHzfbXTwPjF27n+VIX61ZK\noCdUdXgIfR+2G78MPC2nfvaECd4eWqpLusOrJKC3BTMlXOGZ85GR/5ZB+90fEW2W\n+Qgs4qtxEiQszEKjAgMBAAE=\n-----END PUBLIC KEY-----"
  }
};

var me = {
  username: "",

  pkey: "",
  serverKey: "",
  sessionKey: "",

  busy: 0,
  logged: 0,
};

function main() {
  forge.options.usePureJavaScript = true;
  ac = new AppController();
  ac.startServerConnection();
}
