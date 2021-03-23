# Basic CRUD application with Node.js and Serverless framework
In this example, we set up a basic CRUD application. 

## Pre-requisites

In order to deploy the function, you will need the following:

- API Credentials for AWS environment (https://www.youtube.com/watch?v=KngM5bfpttA)
- An AWS environment 
- Serverless framwork installed within package or globally `npm install -g serverless`
- Node.js 15 and `npm` installed locally

## Deploying Serverless Project

1. Clone the repository and install dependencies:
```
npm install
```
2. Deploy serverless using the command:
```
serverless deploy --stage ${ENV}
```

## Testing Serverless Project

1. run the command below
```
serverless invoke -f ${FUNCTION_NAME} --stage ${ENV}
```

## Testing Serverless Project Locally
1. run the command or press F5
```
npm run debug
```