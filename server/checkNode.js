/**
 * Verifie que la version de Node sait fournir `node:sqlite`.
 * Sans ce garde-fou, un Node trop ancien echoue sur un `ERR_UNKNOWN_BUILTIN_MODULE`
 * peu parlant au lieu d'expliquer quoi faire.
 *
 * La verification s'execute a l'import : ce module doit donc etre importe
 * AVANT db.js, qui charge node:sqlite des son evaluation.
 */
// 22.13 : premiere version ou DatabaseSync.function() (fonctions SQL en JS) existe.
const MINIMUM = [22, 13, 0];

function checkNodeVersion() {
  const current = process.versions.node.split(".").map(Number);
  const tooOld =
    current[0] < MINIMUM[0] ||
    (current[0] === MINIMUM[0] && current[1] < MINIMUM[1]);

  if (tooOld) {
    console.error(
      [
        "",
        `  Node ${process.versions.node} est trop ancien pour Yehoo.`,
        `  Le projet utilise le module SQLite integre a Node, disponible a partir de Node ${MINIMUM.join(".")}.`,
        "",
        "  Installez Node 22 LTS ou Node 24 depuis https://nodejs.org, puis relancez.",
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
}

checkNodeVersion();
