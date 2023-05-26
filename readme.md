# SQLPING

sqlping is a very simple module to ping a url + port to see what SQL Server is there.
The idea came from a Google Bard hallucination, where i needed to check for possible ports for a node app that will connect to SQL servers, that were not in the standard port.  Bard gave me a code por a sqlping library that I could never find. 

This is based on sql ping by sql security, that hasn't been updated in a decade. So I created a node version add also added more info about the Microsoft SQL Server, from the list in sqlserverbuilds to update it to 2022 and get some more info on patches. 

## Installation

Use the package npm 
```bash
npm i sqlping
```

## Usage

```js
const {findServer} = require('./findServer.js');

#Expects IP and port
#you can pass an IP adress or localhost
let server = await findServer('localhost', 1433);

# returns an object like this
{
  serverName: 2019,
  serverVersion: 15,
  build: '15.0.2101',
  fileVersion: '2019.150.2101.7',
  description: 'Security update for SQL Server 2019 GDR: February 14, 2023',
  link: 'https://support.microsoft.com/en-us/help/5021125',
  releaseDate: '2023-02-14',
  updateInfo: 'RTM'
}

# Object will be empty if no SQL server on the ip/port combo
foobar.pluralize('goose')


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](https://choosealicense.com/licenses/isc/)