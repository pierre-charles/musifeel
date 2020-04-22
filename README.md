# musifeel

Most up to date repository can be found at https://github.com/Pierre-Charles/musifeel

- [musifeel](#musifeel)
  - [Running online](#running-online)
  - [Running locally](#running-locally)
  - [Quick summary](#quick-summary)


## Running online
To view this project online, visit https://musifeel.com

## Running locally
This is a React application that requires NodeJS to run it locally. To install NodeJS please visit https://nodejs.org/en/.

MacOS users can also install NodeJS using brew via 
```
brew install node
```

To make sure that node has been installed properly, open a new terminal window check your node and npm versions by running the following commands.
```
node -v
npm -v
```

The outputs of the command should be the following (provided the latest version has been installed)

- Node version `13.13.0`
- NPM version `6.14.4`
  
Once Node has been  installed, navigate to the musifeel directory from your terminal window.
For example:
```
cd ~/Projects/musifeel-master
```

Once in the directory, run the following command to install the node modules used in the project (this should take roughly 2-3 minutes).

```
npm install
```
or
``` 
npm i
```
Once done, use the following command to start the project locally. This will take around 1-2 minutes to start a development server.

```
npm run start
```

Then open http://localhost:3000 to view the app in the browser.

## Quick summary
Install node then do the following:
```
git clone git@github.com:Pierre-Charles/musifeel.git musifeel
cd musifeel
npm i
npm run start
open http://localhost:3000/
```


