import { spawn } from 'node:child_process';

const bat = spawn('bash.exe', ['./main.sh']);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.error(data.toString());
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});

bat.stdin.write('Hello\n');
bat.stdin.write('Hello\n');
bat.stdin.write('Hello\n');
