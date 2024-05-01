const stream = require('node:stream');

var PROTO_PATH = __dirname + '/helloworld.proto';

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

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  callback(null, {message: 'Hello ' + call.request.name + ', I am your child'});
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    var server = new grpc.Server();

  const credentials = grpc.ServerCredentials.createInsecure();
  const connectionInjector = server.createConnectionInjector(credentials);
  const stdioStream = stream.Duplex.from({writable: process.stdout, readable: process.stdin});
  connectionInjector.injectConnection(stdioStream);


  server.addService(hello_proto.Greeter.service, {sayHello: sayHello});
  server.bindAsync('0.0.0.0:50051', credentials, () => {
    server.start();
  });
}

main();
