"NgNgocQuy"
upgrade:
    - api:

    - promise: async await
-----------------------------------------
debug log: task: >> [function] >> [query] >> [data] >> [src]
I. admin.

1,user fucntion :

    -login: find user-> update sessionKey = new time -> set session= newKey.

    -logout: delete session

    -session: query session = sessionKey in db

    -premission level: 1-admin, >10-user, >100-viewer, >1000-customer

        -query level with sessionKey

2,product fucntion

    *first: using middleware to check session key and premission level

        - req.body.sessionKey

    -product view: 
