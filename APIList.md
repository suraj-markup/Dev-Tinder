# DevTinder APIs

## status : ignore, interested, accepted, rejected


1. authRouter 
- POST /signup
- POST /signin
- POST /logout

2. ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

3. ConnectionRequestRouter
- POST /request/send/:status/:userId
    - :status=>ignored,interested
- POST /request/review/:status/:requestId
    - :status=>accepted,rejected

4. UserRouter
- GET /user/requests/received
- GET /user/connection
- GET /user/feed  -gets you the profile of other users.



