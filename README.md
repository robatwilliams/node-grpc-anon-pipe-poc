Demonstration of RPC from a parent process to its child using anonymous pipes (stdio).

The code is in `src/anonymous-pipe`. The other directories are previous learning/experimentation.

## Server (child process)
Uses https://github.com/grpc/grpc-node/pull/2675 to allow using the process' duplex'd stdio streams instead of a TCP connection. This usage seems consistent with the intent in the linked proposal to "allow existing TCP connections or TCP connection-like objects to be injected into the server".

As of grpc-js 1.10.6, that feature hasn't been released, so the PR changes must be manually patched into server.js in node_modules. See `src/patches/server.js` for the patched file based on 1.10.6.

## Client (parent process)
Uses https://github.com/grpc/grpc-node/issues/2038#issuecomment-1461728728 to allow using the child process's stdio streams instead of a TCP connection. This technique isn't robust; it relies on the presence of a `secureContext` object to cause an particular internal code path to be taken in https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/transport.ts.

## Background information

On the suitability of anonymous pipes and gRPC for the use case:

* https://learn.microsoft.com/en-gb/aspnet/core/grpc/comparison?view=aspnetcore-8.0#grpc-recommended-scenarios
* https://learn.microsoft.com/en-us/dotnet/standard/io/pipe-operations

On the .NET support for custom IPC transports for gRPC:

* https://learn.microsoft.com/en-gb/aspnet/core/grpc/interprocess?view=aspnetcore-8.0
