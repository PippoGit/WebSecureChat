# WebSecureChat
Browser version of SecureChat made with socket.io and forge.

SecureChat is a simple chat application that uses some of the most famous cybersecurity algorithms to make it "safe".
The server provides a TOFU (Trust On First Use) end-to-end encryption. Clients must be registered to the service in order to use it (the server must know the public keys of its clients)!

# Try it!
Try WebSecureChat on Heroku: https://websecurechat.herokuapp.com

Login as **alice**:
```
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDA5E3VWxdQHEHm3Zza6iom1lK/zyyvoSvyKsNYSbE2JCAGPHEF
nLpQd3mdnFeXimIRHs8p7LFcxbOqGsZ0hHve6DNYUdHfoKpqMX5w6BGhzf4qCZS2
OPN/JtJ5ctI4vd6na4J40QrwxKaG0T17wPsi7uAJ3Wz8l1j8sfJMM8aYIQIDAQAB
AoGBAILEA5QJfeN8VJz7ThQGvW64yz5nZ+bkv5MbtHSM+Ms4cFFp9kEUwCY+6L6V
t7fvQ45RsaW9ZXv8N1GxdyqUihgiUfQ/XzZVEgToIYwlIZIWCoXxwpWgnhVHD2S/
a/58YhJ+msJnE2LdWjAW/ZO2YpIlVbfxBE31dtIaF1/D5gkBAkEA/73WFGH1nvCa
ZVvFPgCs74t/qHGVbJm0jlq8OXwOQsvs9wNfS9x4d1igaKHlUC4aOs79Zelq2LVs
hT3BQA+LcQJBAMEWNS1V4hCornC3+VaE0sh9vX2I+xWz5HXbdpaxrD6gZMUrN2cm
s/33jFGVsGeIswjTkQjmPOxvw+mDBOosn7ECQB/1m1FExKsuKj1McKPE9dehuTxV
pXTC6Jt5n1gXtriGP4DG/Ru/25Yejz1ELiINAN4ki+o2d1HJqlwkUYgt6SECQFRQ
qEP1vtPbdOEP1TdspMab8cUBrfLaLScyAGTpjPeD/r0ClBzdD7gVAxcVMITlcpim
Gi0yrOPqIjiz18+SUOECQQCoMLhdS9YqxEF4nFUpgmYcHDuJxweAJL9jFycn7I1r
0ypFjfTPU+vxg8Lifl110e67F9+nM7Kmz7lvgbZ4ODQm
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDA5E3VWxdQHEHm3Zza6iom1lK/
zyyvoSvyKsNYSbE2JCAGPHEFnLpQd3mdnFeXimIRHs8p7LFcxbOqGsZ0hHve6DNY
UdHfoKpqMX5w6BGhzf4qCZS2OPN/JtJ5ctI4vd6na4J40QrwxKaG0T17wPsi7uAJ
3Wz8l1j8sfJMM8aYIQIDAQAB
-----END PUBLIC KEY-----
```

Login as **bob**:
```
-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDKioSVLUxeoanc7bY/ypy+2WHltPdwH0XFjrVXWlP/fXuH1Cuc
xXztrtUnIxSaX+h9I7aCjuWkA0ZBh94RDowX9HB60+Tmkg3pSRCOV9GqTSqecHvB
qIhZmZYHDo322H/FvkKN7M7Ul6weCDJfTy38U6JBMOLy5Y8VbeUyjYwG6QIDAQAB
AoGASGdkJf/fgSTBmFzR/dPsXL1RJdCfc9F6G7l8UhHUXUz6UAAk5xIiKsWJJUiB
IP6QGcwefmWe6hbRkrODSw2sPnEURt4q9kcATUqyA+b0L/PIrBUo9WAiqIzMOCS3
xS9O31FlI8js14MSOhTq4vVUoOa65cox6yZMrdTiNiZymUECQQDsex7FSKGAUVQg
1Yxa5kcVP7p4p6x0HIoDauqHMS6dq4OVonZczliDjekQgnLIuQBriGAghk1vt1Ik
RQ3AD6L1AkEA20I+Q9PGSyQrFn4SXjafJJdz4ThHSFoOy3v2L68yA5/0WtdeyNwS
IWLnZP3FGQ803Zz/pdkGk/Wzn3fmHh6jpQJAcLBjA2QPAdS/oD3i+lYNvYR22ZQd
S99lrSc/x1iafCwFMkMO4D68U0RGscVX6WqvVo7QL++P6xKSpBH78XACGQJAekHa
tDlexUFaoUUU+uGcJWwp2jhmTuqge0gYwwf+bFUBjLGwkXFczq72dbKm900qXjQP
vKth5pjHWrEhaEQPXQJAHoM8TxetIfi2nSEZN64KWFh1yB6vZ0laFvW3KJY1TlUj
5VIHvBZUFcICLEsakq//rF+bL/+XpcSIQXCERTimvQ==
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKioSVLUxeoanc7bY/ypy+2WHl
tPdwH0XFjrVXWlP/fXuH1CucxXztrtUnIxSaX+h9I7aCjuWkA0ZBh94RDowX9HB6
0+Tmkg3pSRCOV9GqTSqecHvBqIhZmZYHDo322H/FvkKN7M7Ul6weCDJfTy38U6JB
MOLy5Y8VbeUyjYwG6QIDAQAB
-----END PUBLIC KEY-----
```


# To do
* The server should decide the session key with the client! (to be "more sure" that is always fresh)
* BAN Logic (?)

# Known bugs
* SocketIO timeout policy sucks :( 
