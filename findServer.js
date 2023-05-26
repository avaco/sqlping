const net = require('net');
const fs = require('fs');
const path = require('path');

const sqlversions = require('./sqlversions.json');

let server = {};


const data = Buffer.from([
  0x12, 0x01, 0x00, 0x34, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x15, 0x00, 0x06, 0x01, 0x00, 0x1b,
  0x00, 0x01, 0x02, 0x00, 0x1c, 0x00, 0x0c, 0x03,
  0x00, 0x28, 0x00, 0x04, 0xff, 0x08, 0x00, 0x01,
  0x55, 0x00, 0x00, 0x00, 0x4d, 0x53, 0x53, 0x51,
  0x4c, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x00,
  0x04, 0x08, 0x00, 0x00
]);

const findServers = (host = 'localhost',port=1433) => {
    return new Promise((resolve, reject) => {
        const results = findServer(host,port);
        results.then((server) => {
            //console.log("data ready",server);
            resolve(server);
        }).catch((err) => {
            //console.log("error",err);
            resolve({
                serverName : "",
                serverVersion : "",
                build : "",
                fileVersion : "",
                description : "",
                link : "",
                releaseDate : "",
                updateInfo : ""
            })
        });
    });
}


const findServer = async (host = 'localhost',port=1433) => {
    return new Promise((resolve, reject) => {
        server = {};
        const client = net.connect(port, host, () => {
            //console.log('Connected to server!');
            
            // Send the data
            client.write(data);
        });
        
        client.on('data', async(receivedData) => {
            
            //console.log('Received data:', receivedData.toString('hex'));
            const sData = decodeResp(receivedData);
            sData.then((server) => {
                //console.log("data ready",server);
                resolve(server);
            });
                
        });
        
        client.on('end', () => {
            console.log('Disconnected from server!');
        });
        
        client.on('error', (err) => {
            //console.error(err);
            reject(err);
        });
    });
      
}

const decodeResp =  (returndata) => {
    return new Promise((resolve, reject) => {
        n1 = returndata[29];
        n2 = returndata[30];
        n3 = (returndata[31] * 256) + returndata[32];
        
        
        // Variables to hold the SQL server data 
        const build = `${n1}.${n2}.${n3}`;
        let serverName = "";
        let serverVersion = "";
        let fileVersion = "";
        let description = "";
        let link = "";
        let releaseDate = "";
        let updateInfo = "";
        let sFriendlyName = "SQL Server ";

        // Get the server name from json 
        const record = findRecord(build);
        if (record) {
            serverName = record.SQLServer;
            serverVersion = record.Version;
            fileVersion = record.FileVersion;
            description = record.Description;
            link = record.Link;
            releaseDate = record.ReleaseDate;
            updateInfo = getUpdateInfo(record);
        } else {
            switch (n1) {
                case 6:
                if (n2 === 50) {
                    sFriendlyName += "6.5";
                }
                break;
                case 7:
                sFriendlyName += "7";
                break;
                case 8:
                case 80:
                sFriendlyName += "2000";
                break;
                case 9:
                sFriendlyName += "2005";
                break;
                case 10:
                sFriendlyName += "2008";
                break;
                case 11:
                    sFriendlyName += "2012";
                    break;
                case 12:
                    sFriendlyName += "2014";
                    break;
                case 13:
                    sFriendlyName += "2016";
                    break;
                case 14:
                    sFriendlyName += "2017";
                    break;
                case 15:
                    sFriendlyName += "2019";
                    break;
                case 16:
                    sFriendlyName += "2022";
                    break;
            }
            
            if (n1 < 6) {
                sFriendlyName += "[earlier than 6.5]";
            }
            
            if (n1 > 16) {
                sFriendlyName += "[later than 2022 -- tell programmer to update app]";
            }
            serverName = sFriendlyName;
            serverVersion = n1;
        }
        
        let server = {
            serverName : serverName,
            serverVersion : serverVersion,
            build : build,
            fileVersion : fileVersion,
            description : description,
            link : link,
            releaseDate : releaseDate,
            updateInfo : updateInfo
        }
        
        resolve(server);
    });
    
}
  
const findRecord = (buildNumber) => {
    const matches = sqlversions.filter(record => {
        const majorVersion = record.Build.split('.')[0];
        const minorVersion = record.Build.split('.')[1];
        const revisionNumber = record.Build.split('.')[2];
        return `${majorVersion}.${minorVersion}.${revisionNumber}`.toString() == buildNumber.toString()
    });
    
    if (matches.length === 1) {
        return matches[0];
    } else {
       
        return null;
    }
};

const getUpdateInfo = (record) => {
    let updateInfo = "";
    if (record.SP) {
        updateInfo = "SP"
    } else if(record.CU) {
        updateInfo = "CU"
    } else if(record.RTM) {
        updateInfo = "RTM"
    } else if(record.CTP) {
        updateInfo = "CTP"
    } else if(record.HF) {  
        updateInfo = "HF"
    } 
    return updateInfo;
}

exports.findServer = findServers;