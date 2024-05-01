var PROTO_PATH = __dirname + '/helloworld.proto';

const { spawn } = require('node:child_process');
const stream = require('node:stream');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');


var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

async function main() {
  const child = spawn('node.exe', [__dirname + '/child.js']);
  
  // do not uncomment this, it will consume the stream and break things
  // child.stdout.on('data', (data) => {
  //   console.log('data on child stdout', data.toString());
  // });
  child.stderr.on('data on child stderr', (data) => {
    console.error(data.toString());
  });
  child.on('exit', (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });

  await new Promise((resolve) => {
    child.on('spawn', () => {
      console.log('spawned');
      setTimeout(resolve, 1000);  // wait for the child to get the server listening
    });
  })

  const stdioStream = stream.Duplex.from({writable: child.stdin, readable: child.stdout});

  const credentials = grpc.credentials.createInsecure();
  credentials._getConnectionOptions = () => {
    return {
      secureContext: {},  // This is necessary to make it go into a certain code path
      createConnection() {
        return stdioStream;
      }
    }
  }

  var target = 'localhost:50059'; // changed last digit from 1 to prevent TCP socket working
  var client = new hello_proto.Greeter(target, credentials);
  var user = 'world';
  client.sayHello({name: user}, function(err, response) {
    if (err) {
      throw err;
    }
    console.log('Greeting:', response);
  });
}

main();
