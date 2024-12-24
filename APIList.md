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
- POST /request/send/ignore/:userId
- POST /request/send/interested/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

4. UserRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed  -gets you the profile of other users.



