# Aspire Mock API service

Steps to run:
At the root of the project, run:
1. `npm install`
2. `npm run dev`

This will start the service at port 8080 or which is provided in the .env file.

This service uses a sqlite db which is given in src/config/databases/aspire.db

To run the tests,
`npm run test`

Steps to use the application:
1. Sign up at the endpoint /auth/signup
2. Login using the password at /auth/login
3. Use the user.id as token for further requests
4. Pass user id in header with key x-user-id

Now you can create a loan, view the list of loans, approve the loan(admin only) and repay for the loan schedules.
