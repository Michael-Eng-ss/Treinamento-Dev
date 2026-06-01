const { exec } = require("node:child_process");

function checkPostgre() {
  exec("docker exec dev-treinamento-db pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
     process.stdout.write(".");
     checkPostgre();
     return;
    }
    console.log("✅ Postgres está aceitando conexões");
  }
}

process.stdout.write("⏳ Aguardando Postgres");
checkPostgre();
