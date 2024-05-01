Demonstration of RPC from a parent process to its child using anonymous pipes (stdio).

The code is in `src/anonymous-pipe`. The other directories are previous learning/experimentation.

## Server (child process)
Uses https://github.com/grpc/grpc-node/pull/2675 to allow using the process' duplex'd stdio streams instead of a TCP connection. This usage seems consistent with the intent in the linked proposal to "allow existing TCP connections or TCP connection-like objects to be injected into the server".

As of grpc-js 1.10.6, that feature hasn't been released, so the PR changes must be manually patched into server.js in node_modules. It was merged to master two months ago but hasn't made it onto the 1.10 branch.

## Client (parent process)
Uses https://github.com/grpc/grpc-node/issues/2038#issuecomment-1461728728 to allow using the child process's stdio streams instead of a TCP connection. This technique isn't robust; it relies on the presence of a `secureContext` object to cause an particular internal code path to be taken in https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/transport.ts.
