# WebSecureChat
![login SecureChat](https://i.imgur.com/TnE8FyT.png)


*Browser version of SecureChat made with socket.io and forge.*

## The application
SecureChat is a client-server Instant Message service written in Javascript, that used cybersecurity mechanism to provide a TOFU (Trust On First Use) end-to-end encryption. Users must be registered to the service in order to use the chat: at the moment of the registration each user must provide a 1024-bit RSA public key and verify their identity.

The users trust the server authority on public key certification, also they trust that the first time the server provide a public key of a certain user it is correct. This assumption is required to correctly fulfill the end-to-end encryption requirement (the server, if compromised, could be a Man-In-The-Middle and provide the wrong public key for a user and by that it could be able to read the messages of the next sessions; however, this is possible only on the first time the users A and B try to chat, because after the first session they discover each other’s public key).

At the moment of the login the users must specify their username, their public keys and their private keys (string in PEM format). Once logged in, the users can see the list of the connected  and available users and they can request a secure chat by clicking on the username of a specific user. If the recipient accepts the request the two users start an encrypted chat where they are the only entities able to read the messages.

![chat  SecureChat](https://i.imgur.com/CvObPhi.png)

See the full documentation [here](https://github.com/PippoGit/WebSecureChat/blob/master/report/Cybersecurity%20-%20SecureChat.pdf)


## Try it!
Try WebSecureChat on Heroku: https://websecurechat.herokuapp.com

###Login as alice
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

###Login as bob
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
